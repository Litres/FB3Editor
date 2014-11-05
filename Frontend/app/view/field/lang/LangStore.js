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
			{"value": "ru", "name": "русский"},
			{"value": "en", "name": "английский"},
			{"value": "sq", "name": "албанский"},
			{"value": "ar", "name": "арабский"},
			{"value": "hy", "name": "армянский"},
			{"value": "az", "name": "азербайджанский"},
			{"value": "be", "name": "белорусский"},
			{"value": "bg", "name": "болгарский"},
			{"value": "bs", "name": "боснийский"},
			{"value": "vi", "name": "вьетнамский"},
			{"value": "hu", "name": "венгерский"},
			{"value": "nl", "name": "голландский"},
			{"value": "el", "name": "греческий"},
			{"value": "ka", "name": "грузинский"},
			{"value": "da", "name": "датский"},
			{"value": "he", "name": "иврит"},
			{"value": "id", "name": "индонезийский"},
			{"value": "it", "name": "итальянский"},
			{"value": "is", "name": "исландский"},
			{"value": "es", "name": "испанский"},
			{"value": "ca", "name": "каталанский"},
			{"value": "zh", "name": "китайский"},
			{"value": "lv", "name": "латышский"},
			{"value": "lv", "name": "латышский"},
			{"value": "lt", "name": "литовский"},
			{"value": "ms", "name": "малайский"},
			{"value": "mt", "name": "мальтийский"},
			{"value": "mk", "name": "македонский"},
			{"value": "de", "name": "немецкий"},
			{"value": "no", "name": "норвежский"},
			{"value": "pl", "name": "польский"},
			{"value": "pt", "name": "португальский"},
			{"value": "ro", "name": "румынский"},
			{"value": "sr", "name": "сербский"},
			{"value": "sk", "name": "словацкий"},
			{"value": "sl", "name": "словенский"},
			{"value": "th", "name": "тайский"},
			{"value": "tr", "name": "турецкий"},
			{"value": "uk", "name": "украинский"},
			{"value": "fi", "name": "финский"},
			{"value": "fr", "name": "французский"},
			{"value": "hr", "name": "хорватский"},
			{"value": "cs", "name": "чешский"},
			{"value": "sv", "name": "шведский"},
			{"value": "et", "name": "эстонский"}
		]
	}
);