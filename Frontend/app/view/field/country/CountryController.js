/**
 * Контроллер поля выбора страны.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.country.CountryController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.countryfield',

		/**
		 * Отчищает поле, если новое значение не содержится в списке.
		 * @param {FBEditor.view.field.country.Country} cmp Поле.
		 * @param {String} newValue Новое значение.
		 */
		onChange: function (cmp, newValue)
		{
			var view = cmp,
				val = newValue,
				record;

			record = view.findRecordByValue(val);
			if (!record)
			{
				view.setValue('');
			}
		}
	}
);