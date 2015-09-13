/**
 * Хранилище списка языков.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.lang.LangStore',
	{
		extend: 'Ext.data.Store',
		fields: [
			'value',
			'name'
		],
		data: [
			{"value": "", "name": "Это не перевод"},
			{"value": "line", "name": ""},
			{"value": "ru", "name": "Русский"},
			{"value": "uk", "name": "Украинский"},
			{"value": "en", "name": "Английский"},
			{"value": "de", "name": "Немецкий"},
			{"value": "fr", "name": "Французский"},
			{"value": "line", "name": ""},
			{"value": "sq", "name": "Албанский"},
			{"value": "ar", "name": "Арабский"},
			{"value": "hy", "name": "Армянский"},
			{"value": "az", "name": "Азербайджанский"},
			{"value": "be", "name": "Белорусский"},
			{"value": "bg", "name": "Болгарский"},
			{"value": "bs", "name": "Боснийский"},
			{"value": "vi", "name": "Вьетнамский"},
			{"value": "hu", "name": "Венгерский"},
			{"value": "nl", "name": "Голландский"},
			{"value": "el", "name": "Греческий"},
			{"value": "ka", "name": "Грузинский"},
			{"value": "da", "name": "Датский"},
			{"value": "he", "name": "Иврит"},
			{"value": "id", "name": "Индонезийский"},
			{"value": "it", "name": "Итальянский"},
			{"value": "is", "name": "Исландский"},
			{"value": "es", "name": "Испанский"},
			{"value": "ca", "name": "Каталанский"},
			{"value": "zh", "name": "Китайский"},
			{"value": "lv", "name": "Латышский"},
			{"value": "lv", "name": "Латышский"},
			{"value": "lt", "name": "Литовский"},
			{"value": "ms", "name": "Малайский"},
			{"value": "mt", "name": "Мальтийский"},
			{"value": "mk", "name": "Македонский"},
			{"value": "no", "name": "Норвежский"},
			{"value": "pl", "name": "Польский"},
			{"value": "pt", "name": "Португальский"},
			{"value": "ro", "name": "Румынский"},
			{"value": "sr", "name": "Сербский"},
			{"value": "sk", "name": "Словацкий"},
			{"value": "sl", "name": "Словенский"},
			{"value": "th", "name": "Тайский"},
			{"value": "tr", "name": "Турецкий"},
			{"value": "fi", "name": "Финский"},
			{"value": "hr", "name": "Хорватский"},
			{"value": "cs", "name": "Чешский"},
			{"value": "sv", "name": "Шведский"},
			{"value": "et", "name": "Эстонский"}
		]
	}
);