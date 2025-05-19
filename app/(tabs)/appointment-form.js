import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from 'yup';

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
    .required('Durum seçimi zorunludur')
});

export default function AppointmentFormScreen() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);



  const initialValues = {
    customerName: '',
    date: new Date(),
    time: new Date(),
    phoneNumber: '',
    note: '',
    state:'Beklemede'

  };

  const handleSubmit = (values) => {
    console.log('Form Data:', values);
    Alert.alert('Başarılı', 'Randevu başarıyla kaydedildi.');
  };

  return (
    <SafeAreaView className="bg-dark flex-1">
      <ScrollView className="flex-1 px-5">
        <Text className="text-white text-3xl font-oswald mt-5 mb-8">Randevu Ekle / Düzenle</Text>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View>
              {/* Müşteri Adı */}
              <View className="mb-4">
                <Text className="text-white font-oswald mb-2">Müşteri Adı *</Text>
                <TextInput
                  className="bg-light-blue text-black p-3 rounded-lg font-ancizar text-base"
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
                  className="bg-light-blue p-3 rounded-lg"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-black font-ancizar text-base">
                    {values.date.toLocaleDateString('tr-TR')}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={values.date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setFieldValue('date', selectedDate);
                      }
                    }}
                  />
                )}
                {touched.date && errors.date && (
                  <Text className="text-red-500 text-sm mt-1">{errors.date}</Text>
                )}
              </View>

              {/* Saat */}
              <View className="mb-4">
                <Text className="text-white font-oswald mb-2">Saat *</Text>
                <TouchableOpacity
                  className="bg-light-blue p-3 rounded-lg"
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text className="text-black text-base font-ancizar">
                    {values.time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={values.time}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime) {
                        setFieldValue('time', selectedTime);
                      }
                    }}
                  />
                )}
                {touched.time && errors.time && (
                  <Text className="text-red-500 text-sm mt-1">{errors.time}</Text>
                )}
              </View>

              {/* Telefon Numarası */}
              <View className="mb-4">
                <Text className="text-white font-oswald mb-2">Telefon Numarası</Text>
                <TextInput
                  className="bg-light-blue text-black p-3 rounded-lg font-ancizar text-base"
                  value={values.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  placeholder="Telefon numarasını girin (opsiyonel)"
                  placeholderTextColor="#6C757D"
                  keyboardType="phone-pad"
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <Text className="text-red-500 text-sm mt-1">{errors.phoneNumber}</Text>
                )}
              </View>

              {/* Açıklama / Not */}
              <View className="mb-4">
                <Text className="text-white font-oswald mb-2">Açıklama / Not</Text>
                <TextInput
                  className="bg-light-blue text-black p-3 rounded-lg font-ancizar text-base"
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
                onPress={handleSubmit}
              >
                <Text className="text-black text-base text-center font-oswald">Kaydet</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
} 