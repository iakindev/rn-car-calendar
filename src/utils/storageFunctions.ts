import { AsyncStorage } from 'react-native';

const getData = async (key: string) => {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue ? JSON.parse(jsonValue) : {};
	} catch (e) {
		// error reading value
	}
};

const storeData = async (key: string, value: Record<string, any>) => {
	try {
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem(key, jsonValue);
	} catch (e) {
		// saving error
	}
};

export { getData, storeData };
