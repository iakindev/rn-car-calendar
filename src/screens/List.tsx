import { useFocusEffect, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Notifications } from 'expo';
import moment from 'moment';
import React, { useState, useCallback, useContext, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import {
	FAB,
	Headline,
	Text,
	Button,
	ActivityIndicator,
	Paragraph,
	Dialog,
	Portal,
} from 'react-native-paper';

import { RootStackParamList } from '../CalendarApp';
import ListAccordion from '../components/ListAccordion';
import { DataContext } from '../context/DataContext';
import theme from '../theme';
import { storeData } from '../utils';

import 'moment/locale/tr';

const { OS } = Platform;

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'List'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'List'>;

type Props = {
	navigation: ProfileScreenNavigationProp;
	route: ProfileScreenRouteProp;
};

// This screen is clusterfucked.
// Need rewrite or refactor.
const List: React.FC<Props> = ({ route, navigation }) => {
	const { day } = route.params;
	const selectedDate = day.dateString;

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: moment(selectedDate, 'YYYY-MM-DD').format('D MMMM YYYY'),
			headerStyle: {
				backgroundColor: theme.colors.primary,
			},
			headerTintColor: theme.colors.headerText,
		});
	}, [navigation]);

	// @ts-ignore
	const { _dates, _setDates } = useContext(DataContext);
	const [isDialogVisible, setDialogVisible] = useState(false);
	const [contentToDelete, setContentToDelete] = useState('');
	const [, forceUpdate] = useState(true);

	useFocusEffect(
		useCallback(() => {
			forceUpdate((x) => !x);
		}, []),
	);

	function NoItemFound() {
		return (
			<View style={styles.containerCenter}>
				<Headline>Bu tarihte kayıtlı araç bulunamadı</Headline>
				<Text>Araç eklemek için + tuşuna basınız</Text>
			</View>
		);
	}

	return (
		<>
			<View style={styles.container}>
				{!_dates[selectedDate] || Object.keys(_dates[selectedDate]).length === 0 ? (
					<NoItemFound />
				) : (
					<ScrollView>
						{Object.keys(_dates[selectedDate]).map((val, index) => {
							const licensePlate = _dates[selectedDate][val];

							return (
								<ListAccordion
									licensePlateName={val}
									details={licensePlate}
									navigation={navigation}
									functions={{ setContentToDelete, setDialogVisible }}
									key={`${index}`}
									day={day}
								/>
							);
						})}
					</ScrollView>
				)}
				<FAB
					style={styles.fab}
					icon="plus"
					onPress={() => navigation.navigate('Details', { day, edit: false })}
				/>
				<Portal>
					<Dialog visible={isDialogVisible} onDismiss={() => setDialogVisible(false)}>
						<Dialog.Title>Uyarı</Dialog.Title>
						<Dialog.Content>
							<Paragraph>Araç silinsin mi?</Paragraph>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={() => setDialogVisible(false)}>İptal</Button>
							<Button
								onPress={async () => {
									if (OS !== 'web')
										Notifications.cancelScheduledNotificationAsync(
											_dates[selectedDate][contentToDelete].notificationToken,
										);
									delete _dates[selectedDate][contentToDelete];
									await storeData('storage', _dates);
									setDialogVisible(false);
								}}
							>
								Onayla
							</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	containerCenter: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
});

export default List;
