import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

const appointmentsData = {
    '2025-05-20': [
        { time: '10:00', title: 'Alperen Gökçek' },
        { time: '14:00', title: 'Ertuğrul Gökçek' },
        { time: '15:00', title: 'Ertuğrul Gökçek' },
        { time: '16:00', title: 'Ertuğrul Gökçek' },
        { time: '17:00', title: 'Ertuğrul Gökçek' }
    ],
    '2025-05-21': [
        { time: '09:30', title: 'Şükrü Gökçek' }
    ],
    '2025-05-22': [
        { time: '16:00', title: 'Hülya Gökçek' }
    ]
};

LocaleConfig.locales['tr'] = {
    monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    today: 'Bugün'
};

LocaleConfig.defaultLocale = 'tr';


export default function AppointmentsScreen() {
    const [selectedDate, setSelectedDate] = useState('');

    const selectedAppointments = appointmentsData[selectedDate] || [];

    return (
        <SafeAreaView className="bg-dark flex-1">
            <View className="flex-1">
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
                        '2025-05-20': { marked: true, dotColor: '#A8DADC' },
                        '2025-05-21': { marked: true, dotColor: '#A8DADC' },
                        '2025-05-22': { marked: true, dotColor: '#A8DADC' },
                        ...(selectedDate ? {
                            [selectedDate]: {
                                selected: true,
                                selectedColor: '#A8DADC',
                                selectedTextColor: '#0B1215'
                            }
                        } : {})
                    }}
                />

                <ScrollView className="px-5 mt-5">
                    {selectedDate ? (
                        selectedAppointments.length > 0 ? (
                            selectedAppointments.map((appointment, index) => (
                                <Animated.View
                                    key={`${selectedDate}-${index}`}
                                    entering={FadeInDown.delay(index * 100)} 
                                    exiting={FadeOutUp}
                                    className="bg-light-blue rounded-xl p-4 mb-3"
                                >
                                    <Text className="text-dark text-lg font-oswald">
                                        {appointment.time} - {appointment.title}
                                    </Text>
                                </Animated.View>
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
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
