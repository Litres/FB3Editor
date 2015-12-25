/**
 * Корректировки для Ext.form.field.Date.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.form.field.Date',
	{
		override: 'Ext.form.field.Date',

		panelPicker: null,

		createPicker: function ()
		{
			var me = this,
				picker;

			picker = me.callParent(arguments);

			// фикс для повторяющегося события show, чтобы избежать скачков фокуса при открытии календаря
			picker.fireHierarchyEvent = function (eventName) {};

			return picker;
		},

		/**
		 * Переписывает метод для его корректной работы. Так как выбор месяца работает некорректно.
		 * @param e
		 */
		collapseIf: function (e)
		{
			var me = this,
				monthPicker = me.picker.monthPicker,
				isChildEl;

			// является ли кликнутый элемент дочерним по отношению к календарю
			isChildEl = monthPicker && monthPicker.isVisible() ? monthPicker.owns(e.target) : me.owns(e.target);

			if (!me.isDestroyed && !e.within(me.bodyEl, false, true) && !isChildEl)
			{
				me.collapse();
			}
		}
	}
);