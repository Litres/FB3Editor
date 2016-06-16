/**
 * Менеджер редактора текста для описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.editor.Manager',
	{
		extend: 'FBEditor.editor.Manager',

		getPanelProps: function ()
		{
			var bridge = FBEditor.getBridgeProps(),
				panel;

			panel = bridge.Ext.getCmp('panel-props-desc-editor-container');

			return panel;
		}
	}
);