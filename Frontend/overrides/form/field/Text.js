/**
 * Корректировки для Ext.form.field.Text.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.form.field.Text',
	{
		override: 'Ext.form.field.Text',

		getValue: function ()
		{
			var me = this,
				val;

			val = me.callSuper(arguments);
			if (val && Ext.isString(val))
			{
				val = val.trim();
				val = val.replace(/\t/ig, ' ');
			}

			return val;
		}
	}
);