/**
 * Контроллер поля ввода ББК.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.bbk.field.FieldController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.classification.bbk.field',

		onPaste: function ()
		{
			var me = this,
				view = me.getView(),
				plugin;

			// уборка
			plugin = view.getPlugin('fieldCleaner');
			plugin.convertVal();
		}
	}
);