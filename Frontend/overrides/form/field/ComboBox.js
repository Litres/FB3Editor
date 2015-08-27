/**
 * Корректировки для Ext.form.field.ComboBox.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.form.field.ComboBox',
	{
		override: 'Ext.form.field.ComboBox',

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