/**
 * Контроллер блока преамбулы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.preamble.PreambleController',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldsetController',
		alias: 'controller.desc.fieldset.preamble',

		onCheckExpand: function ()
		{
			var me = this,
				view = me.getView(),
				htmleditor;

			htmleditor = view.items.first();
			if (htmleditor.getValue())
			{
				view.expand();
			}
		}
	}
);