/**
 * Контроллер фильтра по жанрам.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.filter.FilterController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.subject.filter',

		/**
		 * Вызывается при изменении значения в поле.
		 * @param {FBEditor.view.form.desc.subject.filter.Filter} field Поле фильтра.
		 * @param {String} newVal Новое значение.
		 * @param {String} oldVal Старое значение.
		 */
		onChange: function (field, newVal, oldVal)
		{
			var me = this,
				tree,
				val = newVal.trim();

			if (oldVal !== val)
			{
				tree = Ext.getCmp('form-desc-subjectTree');
				tree.filter(newVal);
			}
		}
	}
);