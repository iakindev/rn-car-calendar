import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StatusBar } from 'react-native';

import Details from './screens/Details';
import HomeScreen from './screens/HomeScreen';
import List from './screens/List';

export type RootStackParamList = {
	Calendar: undefined;
	List: { day: Record<string, any> };
	Details: { day: Record<string, any>; edit: boolean; editThis?: Record<string, any> | undefined };
};

const Stack = createStackNavigator<RootStackParamList>();

const CalendarApp: React.FC = () => {
	return (
		<NavigationContainer>
			<StatusBar translucent backgroundColor="rgba(0,0,0,0.2)" barStyle="light-content" />
			<Stack.Navigator>
				<Stack.Screen name="Calendar" component={HomeScreen} />
				<Stack.Screen name="List" component={List} />
				<Stack.Screen name="Details" component={Details} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default CalendarApp;
