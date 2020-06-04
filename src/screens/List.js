import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
	FAB,
	List as ListItem,
	Headline,
	Text,
	IconButton,
	ActivityIndicator,
	Colors,
} from 'react-native-paper';
import theme from '../theme';
import { storeData, getData } from '../utils';
import moment from 'moment';
import 'moment/locale/tr';
import call from 'react-native-phone-call';

moment.locale('tr');

function List({ route, navigation }) {
	const day = route.params.day;
	navigation.setOptions({
		headerTitle: moment(day.dateString, 'YYYY-MM-DD').format('D MMMM YYYY'),
		headerStyle: {
			backgroundColor: theme.colors.primary,
		},
		headerTintColor: theme.colors.headerText,
	});

	const [dates, setDates] = useState({});
	const [isLoading, setLoading] = useState(true);

	useFocusEffect(
		useCallback(() => {
			console.log('List');
			let result;
			getData('storage').then((value) => {
				result = value;
				setDates(result);
				console.log('result: ', result);
				setLoading(false);
			});
		}, [])
	);

	useEffect(() => {
		console.log('UPDATED');
	}, [dates]);

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
			{!isLoading ? (
				<View style={styles.container}>
					{!dates[day.dateString] ||
					Object.keys(dates[day.dateString]).length === 0 ? (
						<NoItemFound />
					) : (
						<ScrollView>
							{Object.keys(dates[day.dateString]).map((val) => {
								const desc = `${dates[day.dateString][val].brand} - ${
									dates[day.dateString][val].model
								}\nAlınan Tarih: ${moment(
									dates[day.dateString][val].retrievalDate
								).format('D MMMM YYYY')}`;
								return (
									<ListItem.Accordion
										title={val}
										key={val}
										left={(props) => <ListItem.Icon {...props} icon="car" />}
									>
										<ListItem.Item
											title={`Marka: ${dates[day.dateString][val].brand}`}
											left={(props) => (
												<ListItem.Icon {...props} icon="tag-multiple" />
											)}
										/>
										<ListItem.Item
											title={`Model: ${dates[day.dateString][val].model}`}
											left={(props) => <ListItem.Icon {...props} icon="tag" />}
										/>
										<ListItem.Item
											title={`Müşteri: ${
												dates[day.dateString][val].clientNameSurname
											}`}
											left={(props) => (
												<ListItem.Icon {...props} icon="account" />
											)}
										/>
										<ListItem.Item
											title={`Telefon: ${
												dates[day.dateString][val].clientPhone
											}`}
											left={(props) => (
												<ListItem.Icon {...props} icon="phone" />
											)}
											onPress={() =>
												call({
													number: dates[day.dateString][
														val
													].clientPhone.replace(' ', ''),
													prompt: false,
												}).catch(console.error)
											}
										/>
										{dates[day.dateString][val].referance ? (
											<ListItem.Item
												title={`Referans: ${
													dates[day.dateString][val].referance
												}`}
												left={(props) => (
													<ListItem.Icon {...props} icon="account-multiple" />
												)}
											/>
										) : null}
										<ListItem.Item
											right={(props) => (
												<>
													<ListItem.Icon {...props} icon="pencil" />
													<IconButton
														icon="delete"
														color={Colors.red600}
														size={20}
														onPress={() =>
															delete dates[day.dateString][val] &&
															storeData('storage', dates).then(() => {
																getData('storage').then((data) =>
																	setDates(data)
																);
															})
														}
													/>
												</>
											)}
										/>
									</ListItem.Accordion>
								);
							})}
						</ScrollView>
					)}
					<FAB
						style={styles.fab}
						icon="plus"
						onPress={() => navigation.navigate('Details', day)}
					/>
				</View>
			) : (
				<View style={styles.containerCenter}>
					<ActivityIndicator size="large" />
				</View>
			)}
		</>
	);
}

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
