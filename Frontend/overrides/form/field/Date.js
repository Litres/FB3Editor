/**
 * Корректировки для Ext.form.field.Date.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.form.field.Date',
	{
		override: 'Ext.form.field.Date',

		format: 'Y-m-d',

		createPicker: function ()
		{
			var me = this,
				picker;

			picker = me.callParent(arguments);

			// фикс для повторяющегося события show
			picker.fireHierarchyEvent = function (eventName) {};

			return picker;
		}
	}
);