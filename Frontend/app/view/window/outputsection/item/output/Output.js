/**
 * Комопнент аттрибута output.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.window.outputsection.item.output.Output',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.window.outputsection.item.output.OutputController',
			'FBEditor.view.window.outputsection.item.output.Store'
		],
		
		xtype: 'window-outputsection-item-output',
		controller: 'window.outputsection.item.output',
		
		listeners: {
			change: 'onChange'
		},
		
		editable: false,
		valueField: 'value',
		value: 'default',
		width: 100,
		
		/**
		 * @property {FBEditor.editor.element.section.SectionElement} Элемент.
		 */
		sectionEl: null,
		
		initComponent: function ()
		{
			var me = this;
			
			me.store = Ext.create('FBEditor.view.window.outputsection.item.output.Store');
			
			me.callParent(arguments);
		}
	}
);