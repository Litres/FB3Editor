/**
 * Компонент аттрибута output.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.section.output.Output',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.section.output.Store'
		],
		
		xtype: 'panel-props-body-editor-section-output',
		
		name: 'output',
		anchor: '100%',
		editable: false,
		valueField: 'value',
		value: 'default',
		
		translateText: {
			output: 'output'
		},
		
		initComponent: function ()
		{
			var me = this;
			
			me.store = Ext.create('FBEditor.view.panel.main.props.body.editor.section.output.Store');
			me.fieldLabel = me.translateText.output;
			
			me.callParent(arguments);
		}
	}
);