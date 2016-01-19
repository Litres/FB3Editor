/**
 * Контроллер списка литературных форм.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.bookClass.BookClassController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.bookClass',

		/**
		 * Очищает поле, если новое значение не содержится в списке или пустое.
		 * @param {FBEditor.view.form.desc.bookClass.BookClass} cmp Поле.
		 * @param {String} newValue Новое значение.
		 */
		onChange: function (cmp, newValue)
		{
			var view = cmp,
				val = newValue,
				record;

			record = view.findRecordByValue(val);

			if (!record || !val)
			{
				view.reset();
			}
		}
	}
);