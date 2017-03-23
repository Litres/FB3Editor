/**
 * Панель редактирования элемента span.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.span.Editor',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-props-body-editor-fields-id'
				},
				{
					name: 'class',
					fieldLabel: 'class',
					anchor: '100%'
				}
			];

			me.callParent(arguments);
		}
	}
);