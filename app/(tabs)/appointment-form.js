import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { saveAppointment } from '../../firebase/appointmentService';
import { Platform } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';

const validationSchema = Yup.object().shape({
  customerName: Yup.string()
    .required('Müşteri adı zorunludur'),
  date: Yup.date()
    .required('Tarih seçimi zorunludur'),
  time: Yup.date()
    .required('Saat seçimi zorunludur'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]*$/, 'Sadece rakam giriniz')
    .min(10, 'Telefon numarası en az 10 haneli olmalıdır'),
  note: Yup.string(),
  status: Yup.string()
});

export default function AppointmentFormScreen() {
  const initialValues = {
    customerName: '',
    date: new Date(),
    time: new Date(),
    phoneNumber: '',
    note: '',
    status: 'Beklemede'
  };

  const { user } = useAuth();

  const handleSubmit = async (values, resetForm) => {
    console.log('Form Data:', values);
    try {
      await saveAppointment(user.uid, values);
      Toast.show({
        type: 'success',
        text1: 'Randevu başarıyla kaydedildi',
        position: 'top',
      });
      resetForm();
    } catch (error) {
      console.error('Error saving appointment:', error);
      Toast.show({
        type: 'error',
        text1: 'Randevu kaydedilemedi',
        text2: error.message,
        position: 'top',
      });
    }
  };

  return (
    <SafeAreaView className="bg-dark flex-1">
      <ScrollView className="flex-1 px-5">
        <Text className="text-white text-3xl font-oswald mt-5 mb-8">Randevu Ekle / Düzenle</Text>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
        >
          {({ handleChange, handleBlur, handleSubmit: formikSubmit, values, errors, touched, setFieldValue, resetForm }) => {
            const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
            const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

            const showDatePickerModal = () => setDatePickerVisibility(true);
            const hideDatePickerModal = () => setDatePickerVisibility(false);
            const handleConfirmDate = (date) => {
              setFieldValue('date', date);
              hideDatePickerModal();
            };

            const showTimePickerModal = () => setTimePickerVisibility(true);
            const hideTimePickerModal = () => setTimePickerVisibility(false);
            const handleConfirmTime = (time) => {
              setFieldValue('time', time);
              hideTimePickerModal();
            };

            return (
              <View>
                {/* Müşteri Adı */}
                <View className="mb-4">
                  <Text className="text-white font-oswald mb-2">Müşteri Adı *</Text>
                  <TextInput
                    className="border-light-blue border-b-2 text-white p-3 rounded-lg font-ancizar text-base"
                    value={values.customerName}
                    onChangeText={handleChange('customerName')}
                    onBlur={handleBlur('customerName')}
                    placeholder="Müşteri adını girin"
                    placeholderTextColor="#6C757D"
                  />
                  {touched.customerName && errors.customerName && (
                    <Text className="text-red-500 text-sm mt-1">{errors.customerName}</Text>
                  )}
                </View>

                {/* Tarih */}
                <View className="mb-4">
                  <Text className="text-white font-oswald mb-2">Tarih *</Text>
                  <TouchableOpacity
                    className="border-light-blue border-b-2 text-white p-3 rounded-lg font-ancizar text-base flex-row items-center justify-between"
                    onPress={showDatePickerModal}
                  >
                    <Text className="text-white font-ancizar text-base">
                      {values.date.toLocaleDateString('tr-TR')}
                    </Text>
                    <Ionicons name="calendar" size={24} color="#6C757D" />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePickerModal}
                    onDismiss={hideDatePickerModal}
                  />
                  {touched.date && errors.date && (
                    <Text className="text-red-500 text-sm mt-1">{errors.date}</Text>
                  )}
                </View>

                {/* Saat */}
                <View className="mb-4">
                  <Text className="text-white font-oswald mb-2">Saat *</Text>
                  <TouchableOpacity
                    className="border-light-blue border-b-2 text-white p-3 rounded-lg font-ancizar text-base flex-row items-center justify-between"
                    onPress={showTimePickerModal}
                  >
                    <Text className="text-white text-base font-ancizar">
                      {values.time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Ionicons name="time-outline" size={24} color="#6C757D" />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode="time"
                    onConfirm={handleConfirmTime}
                    onCancel={hideTimePickerModal}
                    onDismiss={hideTimePickerModal}
                  />
                  {touched.time && errors.time && (
                    <Text className="text-red-500 text-sm mt-1">{errors.time}</Text>
                  )}
                </View>

                {/* Telefon Numarası */}
                <View className="mb-4">
                  <Text className="text-white font-oswald mb-2">Telefon Numarası</Text>
                  <TextInput
                    className="border-light-blue border-b-2 text-white p-3 rounded-lg font-ancizar text-base"
                    value={values.phoneNumber}
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    placeholder="Telefon numarasını girin (opsiyonel)"
                    placeholderTextColor="#6C757D"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text className="text-red-500 text-sm mt-1">{errors.phoneNumber}</Text>
                  )}
                </View>

                {/* Açıklama / Not */}
                <View className="mb-4">
                  <Text className="text-white font-oswald mb-2">Açıklama / Not</Text>
                  <TextInput
                    className="border-light-blue border-b-2 text-white p-3 rounded-lg font-ancizar text-base"
                    value={values.note}
                    onChangeText={handleChange('note')}
                    onBlur={handleBlur('note')}
                    placeholder="Açıklama ekleyin (opsiyonel)"
                    placeholderTextColor="#6C757D"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Kaydet Butonu */}
                <TouchableOpacity
                  className="bg-light-blue p-4 rounded-lg mb-8"
                  onPress={() => {
                    formikSubmit();
                  }}
                >
                  <Text className="text-black text-base text-center font-oswald">Kaydet</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
} 