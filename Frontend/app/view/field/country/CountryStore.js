/**
 * Хранилище списка стран.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.country.CountryStore',
	{
		extend: 'Ext.data.Store',
		fields: [
			'value',
			'name'
		],
		data: [
			{value: '', name: 'Неизвестно'},
			{"value": "RU", "name": "\u0420\u043e\u0441\u0441\u0438\u044f"},
			{"value": "AU", "name": "\u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f"},
			{"value": "AT", "name": "\u0410\u0432\u0441\u0442\u0440\u0438\u044f"},
			{"value": "AZ", "name": "\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d"},
			{"value": "AX", "name": "\u0410\u043b\u0430\u043d\u0434\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "AL", "name": "\u0410\u043b\u0431\u0430\u043d\u0438\u044f"},
			{"value": "DZ", "name": "\u0410\u043b\u0436\u0438\u0440"},
			{"value": "VI", "name": "\u0410\u043c\u0435\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u0438\u0435 \u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "AS", "name": "\u0410\u043c\u0435\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u043e\u0435 \u0421\u0430\u043c\u043e\u0430"},
			{"value": "AO", "name": "\u0410\u043d\u0433\u043e\u043b\u0430"},
			{"value": "AI", "name": "\u0410\u043d\u0433\u0443\u0438\u043b\u043b\u0430"},
			{"value": "AD", "name": "\u0410\u043d\u0434\u043e\u0440\u0440\u0430"},
			{"value": "AQ", "name": "\u0410\u043d\u0442\u0430\u0440\u043a\u0442\u0438\u043a\u0430"},
			{"value": "AG", "name": "\u0410\u043d\u0442\u0438\u0433\u0443\u0430 \u0438 \u0411\u0430\u0440\u0431\u0443\u0434\u0430"},
			{"value": "AR", "name": "\u0410\u0440\u0433\u0435\u043d\u0442\u0438\u043d\u0430"},
			{"value": "AM", "name": "\u0410\u0440\u043c\u0435\u043d\u0438\u044f"},
			{"value": "AW", "name": "\u0410\u0440\u0443\u0431\u0430"},
			{"value": "AF", "name": "\u0410\u0444\u0433\u0430\u043d\u0438\u0441\u0442\u0430\u043d"},
			{"value": "BS", "name": "\u0411\u0430\u0433\u0430\u043c\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "BD", "name": "\u0411\u0430\u043d\u0433\u043b\u0430\u0434\u0435\u0448"},
			{"value": "BB", "name": "\u0411\u0430\u0440\u0431\u0430\u0434\u043e\u0441"},
			{"value": "BH", "name": "\u0411\u0430\u0445\u0440\u0435\u0439\u043d"},
			{"value": "BY", "name": "\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u044c"},
			{"value": "BZ", "name": "\u0411\u0435\u043b\u0438\u0437"},
			{"value": "BE", "name": "\u0411\u0435\u043b\u044c\u0433\u0438\u044f"},
			{"value": "BJ", "name": "\u0411\u0435\u043d\u0438\u043d"},
			{"value": "BM", "name": "\u0411\u0435\u0440\u043c\u0443\u0434\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "BG", "name": "\u0411\u043e\u043b\u0433\u0430\u0440\u0438\u044f"},
			{"value": "BO", "name": "\u0411\u043e\u043b\u0438\u0432\u0438\u044f"},
			{"value": "BA", "name": "\u0411\u043e\u0441\u043d\u0438\u044f \u0438 \u0413\u0435\u0440\u0446\u0435\u0433\u043e\u0432\u0438\u043d\u0430"},
			{"value": "BW", "name": "\u0411\u043e\u0442\u0441\u0432\u0430\u043d\u0430"},
			{"value": "BR", "name": "\u0411\u0440\u0430\u0437\u0438\u043b\u0438\u044f"},
			{"value": "IO", "name": "\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u044f \u0432 \u0418\u043d\u0434\u0438\u0439\u0441\u043a\u043e\u043c \u043e\u043a\u0435\u0430\u043d\u0435"},
			{"value": "VG", "name": "\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0438\u0435 \u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "BN", "name": "\u0411\u0440\u0443\u043d\u0435\u0439 \u0414\u0430\u0440\u0443\u0441\u0441\u0430\u043b\u0430\u043c"},
			{"value": "BF", "name": "\u0411\u0443\u0440\u043a\u0438\u043d\u0430 \u0424\u0430\u0441\u043e"},
			{"value": "BI", "name": "\u0411\u0443\u0440\u0443\u043d\u0434\u0438"},
			{"value": "BT", "name": "\u0411\u0443\u0442\u0430\u043d"},
			{"value": "VU", "name": "\u0412\u0430\u043d\u0443\u0430\u0442\u0443"},
			{"value": "VA", "name": "\u0412\u0430\u0442\u0438\u043a\u0430\u043d"},
			{"value": "GB", "name": "\u0412\u0435\u043b\u0438\u043a\u043e\u0431\u0440\u0438\u0442\u0430\u043d\u0438\u044f"},
			{"value": "HU", "name": "\u0412\u0435\u043d\u0433\u0440\u0438\u044f"},
			{"value": "VE", "name": "\u0412\u0435\u043d\u0435\u0441\u0443\u044d\u043b\u0430"},
			{"value": "UM", "name": "\u0412\u043d\u0435\u0448\u043d\u0438\u0435 \u043c\u0430\u043b\u044b\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430 (\u0421\u0428\u0410)"},
			{"value": "TL", "name": "\u0412\u043e\u0441\u0442\u043e\u0447\u043d\u044b\u0439 \u0422\u0438\u043c\u043e\u0440"},
			{"value": "VN", "name": "\u0412\u044c\u0435\u0442\u043d\u0430\u043c"},
			{"value": "GA", "name": "\u0413\u0430\u0431\u043e\u043d"},
			{"value": "HT", "name": "\u0413\u0430\u0438\u0442\u0438"},
			{"value": "GY", "name": "\u0413\u0430\u0439\u0430\u043d\u0430"},
			{"value": "GM", "name": "\u0413\u0430\u043c\u0431\u0438\u044f"},
			{"value": "GH", "name": "\u0413\u0430\u043d\u0430"},
			{"value": "GP", "name": "\u0413\u0432\u0430\u0434\u0435\u043b\u0443\u043f\u0430"},
			{"value": "GT", "name": "\u0413\u0432\u0430\u0442\u0435\u043c\u0430\u043b\u0430"},
			{"value": "GN", "name": "\u0413\u0432\u0438\u043d\u0435\u044f"},
			{"value": "GW", "name": "\u0413\u0432\u0438\u043d\u0435\u044f-\u0411\u0438\u0441\u0441\u0430\u0443"},
			{"value": "DE", "name": "\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f"},
			{"value": "GG", "name": "\u0413\u0435\u0440\u043d\u0441\u0438"},
			{"value": "GI", "name": "\u0413\u0438\u0431\u0440\u0430\u043b\u0442\u0430\u0440"},
			{"value": "HN", "name": "\u0413\u043e\u043d\u0434\u0443\u0440\u0430\u0441"},
			{"value": "HK", "name": "\u0413\u043e\u043d\u043a\u043e\u043d\u0433, \u041e\u0441\u043e\u0431\u044b\u0439 \u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0439 \u0420\u0430\u0439\u043e\u043d \u041a\u0438\u0442\u0430\u044f"},
			{"value": "GD", "name": "\u0413\u0440\u0435\u043d\u0430\u0434\u0430"},
			{"value": "GL", "name": "\u0413\u0440\u0435\u043d\u043b\u0430\u043d\u0434\u0438\u044f"},
			{"value": "GR", "name": "\u0413\u0440\u0435\u0446\u0438\u044f"},
			{"value": "GE", "name": "\u0413\u0440\u0443\u0437\u0438\u044f"},
			{"value": "GU", "name": "\u0413\u0443\u0430\u043c"},
			{"value": "DK", "name": "\u0414\u0430\u043d\u0438\u044f"},
			{"value": "CD", "name": "\u0414\u0435\u043c\u043e\u043a\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u043e\u043d\u0433\u043e"},
			{"value": "JE", "name": "\u0414\u0436\u0435\u0440\u0441\u0438"},
			{"value": "DJ", "name": "\u0414\u0436\u0438\u0431\u0443\u0442\u0438"},
			{"value": "DO", "name": "\u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430"},
			{"value": "EG", "name": "\u0415\u0433\u0438\u043f\u0435\u0442"},
			{"value": "ZM", "name": "\u0417\u0430\u043c\u0431\u0438\u044f"},
			{"value": "EH", "name": "\u0417\u0430\u043f\u0430\u0434\u043d\u0430\u044f \u0421\u0430\u0445\u0430\u0440\u0430"},
			{"value": "ZW", "name": "\u0417\u0438\u043c\u0431\u0430\u0431\u0432\u0435"},
			{"value": "IL", "name": "\u0418\u0437\u0440\u0430\u0438\u043b\u044c"},
			{"value": "IN", "name": "\u0418\u043d\u0434\u0438\u044f"},
			{"value": "ID", "name": "\u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f"},
			{"value": "JO", "name": "\u0418\u043e\u0440\u0434\u0430\u043d\u0438\u044f"},
			{"value": "IQ", "name": "\u0418\u0440\u0430\u043a"},
			{"value": "IR", "name": "\u0418\u0440\u0430\u043d"},
			{"value": "IE", "name": "\u0418\u0440\u043b\u0430\u043d\u0434\u0438\u044f"},
			{"value": "IS", "name": "\u0418\u0441\u043b\u0430\u043d\u0434\u0438\u044f"},
			{"value": "ES", "name": "\u0418\u0441\u043f\u0430\u043d\u0438\u044f"},
			{"value": "IT", "name": "\u0418\u0442\u0430\u043b\u0438\u044f"},
			{"value": "YE", "name": "\u0419\u0435\u043c\u0435\u043d"},
			{"value": "KZ", "name": "\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d"},
			{"value": "KY", "name": "\u041a\u0430\u0439\u043c\u0430\u043d\u043e\u0432\u044b \u043e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "KH", "name": "\u041a\u0430\u043c\u0431\u043e\u0434\u0436\u0430"},
			{"value": "CM", "name": "\u041a\u0430\u043c\u0435\u0440\u0443\u043d"},
			{"value": "CA", "name": "\u041a\u0430\u043d\u0430\u0434\u0430"},
			{"value": "QA", "name": "\u041a\u0430\u0442\u0430\u0440"},
			{"value": "KE", "name": "\u041a\u0435\u043d\u0438\u044f"},
			{"value": "CY", "name": "\u041a\u0438\u043f\u0440"},
			{"value": "KI", "name": "\u041a\u0438\u0440\u0438\u0431\u0430\u0442\u0438"},
			{"value": "CN", "name": "\u041a\u0438\u0442\u0430\u0439"},
			{"value": "CC", "name": "\u041a\u043e\u043a\u043e\u0441\u043e\u0432\u044b\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "CO", "name": "\u041a\u043e\u043b\u0443\u043c\u0431\u0438\u044f"},
			{"value": "KM", "name": "\u041a\u043e\u043c\u043e\u0440\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "CG", "name": "\u041a\u043e\u043d\u0433\u043e"},
			{"value": "KP", "name": "\u041a\u043e\u0440\u0435\u0439\u0441\u043a\u0430\u044f \u041d\u0430\u0440\u043e\u0434\u043d\u043e-\u0414\u0435\u043c\u043e\u043a\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430"},
			{"value": "CR", "name": "\u041a\u043e\u0441\u0442\u0430-\u0420\u0438\u043a\u0430"},
			{"value": "CI", "name": "\u041a\u043e\u0442 \u0434\u2019\u0418\u0432\u0443\u0430\u0440"},
			{"value": "CU", "name": "\u041a\u0443\u0431\u0430"},
			{"value": "KW", "name": "\u041a\u0443\u0432\u0435\u0439\u0442"},
			{"value": "KG", "name": "\u041a\u044b\u0440\u0433\u044b\u0437\u0441\u0442\u0430\u043d"},
			{"value": "LA", "name": "\u041b\u0430\u043e\u0441"},
			{"value": "LV", "name": "\u041b\u0430\u0442\u0432\u0438\u044f"},
			{"value": "LS", "name": "\u041b\u0435\u0441\u043e\u0442\u043e"},
			{"value": "LR", "name": "\u041b\u0438\u0431\u0435\u0440\u0438\u044f"},
			{"value": "LB", "name": "\u041b\u0438\u0432\u0430\u043d"},
			{"value": "LY", "name": "\u041b\u0438\u0432\u0438\u044f"},
			{"value": "LT", "name": "\u041b\u0438\u0442\u0432\u0430"},
			{"value": "LI", "name": "\u041b\u0438\u0445\u0442\u0435\u043d\u0448\u0442\u0435\u0439\u043d"},
			{"value": "LU", "name": "\u041b\u044e\u043a\u0441\u0435\u043c\u0431\u0443\u0440\u0433"},
			{"value": "MU", "name": "\u041c\u0430\u0432\u0440\u0438\u043a\u0438\u0439"},
			{"value": "MR", "name": "\u041c\u0430\u0432\u0440\u0438\u0442\u0430\u043d\u0438\u044f"},
			{"value": "MG", "name": "\u041c\u0430\u0434\u0430\u0433\u0430\u0441\u043a\u0430\u0440"},
			{"value": "YT", "name": "\u041c\u0430\u0439\u043e\u0442\u0442\u0430"},
			{"value": "MO", "name": "\u041c\u0430\u043a\u0430\u043e (\u043e\u0441\u043e\u0431\u044b\u0439 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0439 \u0440\u0430\u0439\u043e\u043d \u041a\u041d\u0420)"},
			{"value": "MK", "name": "\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0438\u044f"},
			{"value": "MW", "name": "\u041c\u0430\u043b\u0430\u0432\u0438"},
			{"value": "MY", "name": "\u041c\u0430\u043b\u0430\u0439\u0437\u0438\u044f"},
			{"value": "ML", "name": "\u041c\u0430\u043b\u0438"},
			{"value": "MV", "name": "\u041c\u0430\u043b\u044c\u0434\u0438\u0432\u044b"},
			{"value": "MT", "name": "\u041c\u0430\u043b\u044c\u0442\u0430"},
			{"value": "MA", "name": "\u041c\u0430\u0440\u043e\u043a\u043a\u043e"},
			{"value": "MQ", "name": "\u041c\u0430\u0440\u0442\u0438\u043d\u0438\u043a"},
			{"value": "MH", "name": "\u041c\u0430\u0440\u0448\u0430\u043b\u043b\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "MX", "name": "\u041c\u0435\u043a\u0441\u0438\u043a\u0430"},
			{"value": "MZ", "name": "\u041c\u043e\u0437\u0430\u043c\u0431\u0438\u043a"},
			{"value": "MD", "name": "\u041c\u043e\u043b\u0434\u043e\u0432\u0430"},
			{"value": "MC", "name": "\u041c\u043e\u043d\u0430\u043a\u043e"},
			{"value": "MN", "name": "\u041c\u043e\u043d\u0433\u043e\u043b\u0438\u044f"},
			{"value": "MS", "name": "\u041c\u043e\u043d\u0441\u0435\u0440\u0440\u0430\u0442"},
			{"value": "MM", "name": "\u041c\u044c\u044f\u043d\u043c\u0430"},
			{"value": "NA", "name": "\u041d\u0430\u043c\u0438\u0431\u0438\u044f"},
			{"value": "NR", "name": "\u041d\u0430\u0443\u0440\u0443"},
			{"value": "ZZ", "name": "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0438\u043b\u0438 \u043d\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0439 \u0440\u0435\u0433\u0438\u043e\u043d"},
			{"value": "NP", "name": "\u041d\u0435\u043f\u0430\u043b"},
			{"value": "NE", "name": "\u041d\u0438\u0433\u0435\u0440"},
			{"value": "NG", "name": "\u041d\u0438\u0433\u0435\u0440\u0438\u044f"},
			{"value": "AN", "name": "\u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u0441\u043a\u0438\u0435 \u0410\u043d\u0442\u0438\u043b\u044c\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "NL", "name": "\u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u044b"},
			{"value": "NI", "name": "\u041d\u0438\u043a\u0430\u0440\u0430\u0433\u0443\u0430"},
			{"value": "NU", "name": "\u041d\u0438\u0443\u0435"},
			{"value": "NZ", "name": "\u041d\u043e\u0432\u0430\u044f \u0417\u0435\u043b\u0430\u043d\u0434\u0438\u044f"},
			{"value": "NC", "name": "\u041d\u043e\u0432\u0430\u044f \u041a\u0430\u043b\u0435\u0434\u043e\u043d\u0438\u044f"},
			{"value": "NO", "name": "\u041d\u043e\u0440\u0432\u0435\u0433\u0438\u044f"},
			{"value": "AE", "name": "\u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0435\u043d\u043d\u044b\u0435 \u0410\u0440\u0430\u0431\u0441\u043a\u0438\u0435 \u042d\u043c\u0438\u0440\u0430\u0442\u044b"},
			{"value": "OM", "name": "\u041e\u043c\u0430\u043d"},
			{"value": "BV", "name": "\u041e\u0441\u0442\u0440\u043e\u0432 \u0411\u0443\u0432\u0435"},
			{"value": "DM", "name": "\u041e\u0441\u0442\u0440\u043e\u0432 \u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430"},
			{"value": "IM", "name": "\u041e\u0441\u0442\u0440\u043e\u0432 \u041c\u044d\u043d"},
			{"value": "NF", "name": "\u041e\u0441\u0442\u0440\u043e\u0432 \u041d\u043e\u0440\u0444\u043e\u043b\u043a"},
			{"value": "CX", "name": "\u041e\u0441\u0442\u0440\u043e\u0432 \u0420\u043e\u0436\u0434\u0435\u0441\u0442\u0432\u0430"},
			{"value": "BL", "name": "\u041e\u0441\u0442\u0440\u043e\u0432 \u0421\u0432\u044f\u0442\u043e\u0433\u043e \u0411\u0430\u0440\u0442\u043e\u043b\u043e\u043c\u0435\u044f"},
			{"value": "MF", "name": "\u041e\u0441\u0442\u0440\u043e\u0432 \u0421\u0432\u044f\u0442\u043e\u0433\u043e \u041c\u0430\u0440\u0442\u0438\u043d\u0430"},
			{"value": "SH", "name": "\u041e\u0441\u0442\u0440\u043e\u0432 \u0421\u0432\u044f\u0442\u043e\u0439 \u0415\u043b\u0435\u043d\u044b"},
			{"value": "CV", "name": "\u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u0417\u0435\u043b\u0435\u043d\u043e\u0433\u043e \u041c\u044b\u0441\u0430"},
			{"value": "CK", "name": "\u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u041a\u0443\u043a\u0430"},
			{"value": "TC", "name": "\u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u0422\u0451\u0440\u043a\u0441 \u0438 \u041a\u0430\u0439\u043a\u043e\u0441"},
			{"value": "HM", "name": "\u041e\u0441\u0442\u0440\u043e\u0432\u0430 \u0425\u0435\u0440\u0434 \u0438 \u041c\u0430\u043a\u0434\u043e\u043d\u0430\u043b\u044c\u0434"},
			{"value": "PK", "name": "\u041f\u0430\u043a\u0438\u0441\u0442\u0430\u043d"},
			{"value": "PW", "name": "\u041f\u0430\u043b\u0430\u0443"},
			{"value": "PS", "name": "\u041f\u0430\u043b\u0435\u0441\u0442\u0438\u043d\u0441\u043a\u0430\u044f \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u0438\u044f"},
			{"value": "PA", "name": "\u041f\u0430\u043d\u0430\u043c\u0430"},
			{"value": "PG", "name": "\u041f\u0430\u043f\u0443\u0430-\u041d\u043e\u0432\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f"},
			{"value": "PY", "name": "\u041f\u0430\u0440\u0430\u0433\u0432\u0430\u0439"},
			{"value": "PE", "name": "\u041f\u0435\u0440\u0443"},
			{"value": "PN", "name": "\u041f\u0438\u0442\u043a\u0435\u0440\u043d"},
			{"value": "PL", "name": "\u041f\u043e\u043b\u044c\u0448\u0430"},
			{"value": "PT", "name": "\u041f\u043e\u0440\u0442\u0443\u0433\u0430\u043b\u0438\u044f"},
			{"value": "PR", "name": "\u041f\u0443\u044d\u0440\u0442\u043e-\u0420\u0438\u043a\u043e"},
			{"value": "KR", "name": "\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u043e\u0440\u0435\u044f"},
			{"value": "RE", "name": "\u0420\u0435\u044e\u043d\u044c\u043e\u043d"},
			{"value": "RW", "name": "\u0420\u0443\u0430\u043d\u0434\u0430"},
			{"value": "RO", "name": "\u0420\u0443\u043c\u044b\u043d\u0438\u044f"},
			{"value": "US", "name": "\u0421\u0428\u0410"},
			{"value": "SV", "name": "\u0421\u0430\u043b\u044c\u0432\u0430\u0434\u043e\u0440"},
			{"value": "WS", "name": "\u0421\u0430\u043c\u043e\u0430"},
			{"value": "SM", "name": "\u0421\u0430\u043d-\u041c\u0430\u0440\u0438\u043d\u043e"},
			{"value": "ST", "name": "\u0421\u0430\u043d-\u0422\u043e\u043c\u0435 \u0438 \u041f\u0440\u0438\u043d\u0441\u0438\u043f\u0438"},
			{"value": "SA", "name": "\u0421\u0430\u0443\u0434\u043e\u0432\u0441\u043a\u0430\u044f \u0410\u0440\u0430\u0432\u0438\u044f"},
			{"value": "SZ", "name": "\u0421\u0432\u0430\u0437\u0438\u043b\u0435\u043d\u0434"},
			{"value": "SJ", "name": "\u0421\u0432\u0430\u043b\u044c\u0431\u0430\u0440\u0434 \u0438 \u042f\u043d-\u041c\u0430\u0439\u0435\u043d"},
			{"value": "MP", "name": "\u0421\u0435\u0432\u0435\u0440\u043d\u044b\u0435 \u041c\u0430\u0440\u0438\u0430\u043d\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "SC", "name": "\u0421\u0435\u0439\u0448\u0435\u043b\u044c\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "PM", "name": "\u0421\u0435\u043d-\u041f\u044c\u0435\u0440 \u0438 \u041c\u0438\u043a\u0435\u043b\u043e\u043d"},
			{"value": "SN", "name": "\u0421\u0435\u043d\u0435\u0433\u0430\u043b"},
			{"value": "VC", "name": "\u0421\u0435\u043d\u0442-\u0412\u0438\u043d\u0441\u0435\u043d\u0442 \u0438 \u0413\u0440\u0435\u043d\u0430\u0434\u0438\u043d\u044b"},
			{"value": "KN", "name": "\u0421\u0435\u043d\u0442-\u041a\u0438\u0442\u0442\u0441 \u0438 \u041d\u0435\u0432\u0438\u0441"},
			{"value": "LC", "name": "\u0421\u0435\u043d\u0442-\u041b\u044e\u0441\u0438\u044f"},
			{"value": "RS", "name": "\u0421\u0435\u0440\u0431\u0438\u044f"},
			{"value": "CS", "name": "\u0421\u0435\u0440\u0431\u0438\u044f \u0438 \u0427\u0435\u0440\u043d\u043e\u0433\u043e\u0440\u0438\u044f"},
			{"value": "SG", "name": "\u0421\u0438\u043d\u0433\u0430\u043f\u0443\u0440"},
			{"value": "SY", "name": "\u0421\u0438\u0440\u0438\u0439\u0441\u043a\u0430\u044f \u0410\u0440\u0430\u0431\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430"},
			{"value": "SK", "name": "\u0421\u043b\u043e\u0432\u0430\u043a\u0438\u044f"},
			{"value": "SI", "name": "\u0421\u043b\u043e\u0432\u0435\u043d\u0438\u044f"},
			{"value": "SB", "name": "\u0421\u043e\u043b\u043e\u043c\u043e\u043d\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "SO", "name": "\u0421\u043e\u043c\u0430\u043b\u0438"},
			{"value": "SD", "name": "\u0421\u0443\u0434\u0430\u043d"},
			{"value": "SR", "name": "\u0421\u0443\u0440\u0438\u043d\u0430\u043c"},
			{"value": "SL", "name": "\u0421\u044c\u0435\u0440\u0440\u0430-\u041b\u0435\u043e\u043d\u0435"},
			{"value": "TJ", "name": "\u0422\u0430\u0434\u0436\u0438\u043a\u0438\u0441\u0442\u0430\u043d"},
			{"value": "TH", "name": "\u0422\u0430\u0438\u043b\u0430\u043d\u0434"},
			{"value": "TW", "name": "\u0422\u0430\u0439\u0432\u0430\u043d\u044c"},
			{"value": "TZ", "name": "\u0422\u0430\u043d\u0437\u0430\u043d\u0438\u044f"},
			{"value": "TG", "name": "\u0422\u043e\u0433\u043e"},
			{"value": "TK", "name": "\u0422\u043e\u043a\u0435\u043b\u0430\u0443"},
			{"value": "TO", "name": "\u0422\u043e\u043d\u0433\u0430"},
			{"value": "TT", "name": "\u0422\u0440\u0438\u043d\u0438\u0434\u0430\u0434 \u0438 \u0422\u043e\u0431\u0430\u0433\u043e"},
			{"value": "TV", "name": "\u0422\u0443\u0432\u0430\u043b\u0443"},
			{"value": "TN", "name": "\u0422\u0443\u043d\u0438\u0441"},
			{"value": "TM", "name": "\u0422\u0443\u0440\u043a\u043c\u0435\u043d\u0438\u0441\u0442\u0430\u043d"},
			{"value": "TR", "name": "\u0422\u0443\u0440\u0446\u0438\u044f"},
			{"value": "UG", "name": "\u0423\u0433\u0430\u043d\u0434\u0430"},
			{"value": "UZ", "name": "\u0423\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u0430\u043d"},
			{"value": "UA", "name": "\u0423\u043a\u0440\u0430\u0438\u043d\u0430"},
			{"value": "WF", "name": "\u0423\u043e\u043b\u043b\u0438\u0441 \u0438 \u0424\u0443\u0442\u0443\u043d\u0430"},
			{"value": "UY", "name": "\u0423\u0440\u0443\u0433\u0432\u0430\u0439"},
			{"value": "FO", "name": "\u0424\u0430\u0440\u0435\u0440\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "FM", "name": "\u0424\u0435\u0434\u0435\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0435 \u0428\u0442\u0430\u0442\u044b \u041c\u0438\u043a\u0440\u043e\u043d\u0435\u0437\u0438\u0438"},
			{"value": "FJ", "name": "\u0424\u0438\u0434\u0436\u0438"},
			{"value": "PH", "name": "\u0424\u0438\u043b\u0438\u043f\u043f\u0438\u043d\u044b"},
			{"value": "FI", "name": "\u0424\u0438\u043d\u043b\u044f\u043d\u0434\u0438\u044f"},
			{"value": "FK", "name": "\u0424\u043e\u043b\u043a\u043b\u0435\u043d\u0434\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "FR", "name": "\u0424\u0440\u0430\u043d\u0446\u0438\u044f"},
			{"value": "GF", "name": "\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u0413\u0432\u0438\u0430\u043d\u0430"},
			{"value": "PF", "name": "\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u041f\u043e\u043b\u0438\u043d\u0435\u0437\u0438\u044f"},
			{"value": "TF", "name": "\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0438\u0435 \u042e\u0436\u043d\u044b\u0435 \u0422\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u0438"},
			{"value": "HR", "name": "\u0425\u043e\u0440\u0432\u0430\u0442\u0438\u044f"},
			{"value": "CF", "name": "\u0426\u0435\u043d\u0442\u0440\u0430\u043b\u044c\u043d\u043e-\u0410\u0444\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430"},
			{"value": "TD", "name": "\u0427\u0430\u0434"},
			{"value": "ME", "name": "\u0427\u0435\u0440\u043d\u043e\u0433\u043e\u0440\u0438\u044f"},
			{"value": "CZ", "name": "\u0427\u0435\u0448\u0441\u043a\u0430\u044f \u0440\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430"},
			{"value": "CL", "name": "\u0427\u0438\u043b\u0438"},
			{"value": "CH", "name": "\u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044f"},
			{"value": "SE", "name": "\u0428\u0432\u0435\u0446\u0438\u044f"},
			{"value": "LK", "name": "\u0428\u0440\u0438-\u041b\u0430\u043d\u043a\u0430"},
			{"value": "EC", "name": "\u042d\u043a\u0432\u0430\u0434\u043e\u0440"},
			{"value": "GQ", "name": "\u042d\u043a\u0432\u0430\u0442\u043e\u0440\u0438\u0430\u043b\u044c\u043d\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f"},
			{"value": "ER", "name": "\u042d\u0440\u0438\u0442\u0440\u0435\u044f"},
			{"value": "EE", "name": "\u042d\u0441\u0442\u043e\u043d\u0438\u044f"},
			{"value": "ET", "name": "\u042d\u0444\u0438\u043e\u043f\u0438\u044f"},
			{"value": "ZA", "name": "\u042e\u0436\u043d\u0430\u044f \u0410\u0444\u0440\u0438\u043a\u0430"},
			{"value": "GS", "name": "\u042e\u0436\u043d\u0430\u044f \u0414\u0436\u043e\u0440\u0434\u0436\u0438\u044f \u0438 \u042e\u0436\u043d\u044b\u0435 \u0421\u0430\u043d\u0434\u0432\u0438\u0447\u0435\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430"},
			{"value": "JM", "name": "\u042f\u043c\u0430\u0439\u043a\u0430"},
			{"value": "JP", "name": "\u042f\u043f\u043e\u043d\u0438\u044f"}
		]
	}
);