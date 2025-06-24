import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { fetchAppointments } from '../../firebase/appointmentService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

LocaleConfig.locales['tr'] = {
    monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    today: 'Bugün'
};

LocaleConfig.defaultLocale = 'tr';

export default function AppointmentsScreen() {
    // Başlangıçta bugünün tarihi seçili olsun
    const todayString = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayString);
    const [appointmentsData, setAppointmentsData] = useState({});
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const loadAppointments = async () => {
                try {
                    const data = await fetchAppointments();
                    const groupedByDate = {};
                    if (data) {
                        Object.keys(data).forEach(key => {
                            const appointment = data[key];
                            let dateString = appointment.date;
                            let timeString = appointment.time;

                            if (!dateString && appointment.createdAt) {
                                try {
                                    const createdAtDate = new Date(appointment.createdAt);
                                    dateString = createdAtDate.toISOString().split('T')[0];
                                    timeString = createdAtDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                                } catch (error) {
                                    console.error('Error parsing createdAt for appointment', key, ':', error);
                                    return;
                                }
                            }

                            if (dateString && timeString) {
                                if (!groupedByDate[dateString]) {
                                    groupedByDate[dateString] = [];
                                }
                                if (!appointment.id) {
                                    appointment.id = key;
                                }
                                if (!appointment.time && timeString) {
                                    appointment.time = timeString;
                                }
                                groupedByDate[dateString].push(appointment);
                            } else {
                                console.warn(`Appointment ${key} is missing date/time or createdAt and will be skipped.`);
                            }
                        });
                    }
                    setAppointmentsData(groupedByDate);
                } catch (error) {
                    console.error('Failed to load appointments:', error);
                    // Optionally show an error message to the user
                }
            };

            loadAppointments();
        }, [])
    );

    const selectedAppointments = appointmentsData[selectedDate] || [];

    const handleAppointmentPress = (appointment) => {
        router.push({
            pathname: "/(stack)/details",
            params: { 
                appointment: JSON.stringify({
                    ...appointment,
                    date: selectedDate
                })
            }
        });
    };

    return (
        <SafeAreaView className="bg-dark flex-1">
            <ScrollView className="flex-1">
                <Text className="text-white text-3xl font-oswald p-5">Randevular</Text>
                <Calendar
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    theme={{
                        backgroundColor: '#0B1215',
                        calendarBackground: '#0B1215',
                        textSectionTitleColor: '#A8DADC',
                        selectedDayBackgroundColor: '#A8DADC',
                        selectedDayTextColor: '#0B1215',
                        todayTextColor: '#A8DADC',
                        dayTextColor: '#fff',
                        textDisabledColor: '#6C757D',
                        dotColor: '#A8DADC',
                        selectedDotColor: '#0B1215',
                        arrowColor: '#A8DADC',
                        monthTextColor: '#A8DADC',
                        indicatorColor: '#A8DADC',
                        textDayFontFamily: 'Oswald-Light',
                        textMonthFontFamily: 'Oswald-Light',
                        textDayHeaderFontFamily: 'Oswald-Light',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16
                    }}
                    markedDates={{
                        // Mark dates that have appointments
                        ...Object.keys(appointmentsData).reduce((acc, date) => {
                            acc[date] = { marked: true, dotColor: '#A8DADC' };
                            return acc;
                        }, {}),
                        // Mark the selected date
                        ...(selectedDate ? {
                            [selectedDate]: {
                                selected: true,
                                selectedColor: '#A8DADC',
                                selectedTextColor: '#0B1215',
                                // Preserve marked status if it exists
                                ...(appointmentsData[selectedDate] ? { marked: true, dotColor: '#A8DADC' } : {})
                            }
                        } : {})
                    }}
                />
                <Text className="text-gray-500 font-oswald text-center text-base mb-2">Randevu hakkında detay için randevuya tıklayınız</Text>
                <View className="bg-dark-gray p-4 rounded-lg mx-6">
                    <Text className="text-white font-oswald text-xl mb-4">Seçilen Günün Randevuları</Text>
                    {selectedDate ? (
                        selectedAppointments.length > 0 ? (
                            selectedAppointments.sort((a, b) => a.time.localeCompare(b.time)).map((appointment, index) => (
                                <TouchableOpacity
                                    key={`${selectedDate}-${index}-${appointment.id || index}`}
                                    onPress={() => handleAppointmentPress(appointment)}
                                >
                                    <Animated.View
                                        entering={FadeInDown.delay(index * 100)}
                                        exiting={FadeOutUp}
                                        className="bg-light-blue rounded-xl p-4 mb-3"
                                    >
                                        <View className="flex-row justify-between items-start">
                                            <View>
                                                <View className="flex-row items-center">
                                                    <FontAwesome name="clock-o" size={20} color="#0B1215" />
                                                    <Text className="text-dark font-oswald text-base ml-2">{appointment.time || '--:--'}</Text>
                                                </View>
                                                {appointment.note && (
                                                    <View className="flex-row items-center mt-3 ml-2">
                                                        <FontAwesome name="sticky-note-o" size={16} color="#0B1215" />
                                                        <Text className="text-dark font-oswald text-base ml-1">Not var</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View className="items-center justify-center">
                                                <Text className="text-dark font-oswald text-sm">Durum</Text>
                                                <Text className={`text-dark font-oswald text-lg ${appointment.status === 'Beklemede' ? 'text-yellow-600' :  'text-green-600'}`}>{appointment.status || '--'}</Text>
                                            </View>
                                            <View className="items-end">
                                                <Text className="text-dark font-oswald text-lg">{appointment.customerName || 'Bilinmiyor'}</Text>
                                                <Text className="text-dark font-oswald text-base">{appointment.phoneNumber}</Text>
                                            </View>
                                        </View>
                                    </Animated.View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text className="text-gray-400 font-oswald text-center mt-3">
                                {selectedDate} için randevu bulunamadı.
                            </Text>
                        )
                    ) : (
                        <Text className="text-gray-400 font-oswald text-center mt-3">
                            Bir tarih seçin.
                        </Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
