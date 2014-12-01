/**
 * Контроллер поля выбора образования.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.target.EducationController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.classification.target.education',

		/**
		 * Отчищает поле, если новое значение не содержится в списке.
		 * @param {FBEditor.view.form.desc.classification.target.Education} cmp Поле.
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