/**
 * Комопнент настройки отдельной секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.window.outputsection.item.Item',
	{
		extend: 'Ext.Panel',
		requires: [
			'FBEditor.view.window.outputsection.item.name.Name',
			'FBEditor.view.window.outputsection.item.output.Output'
		],
		
		xtype: 'window-outputsection-item',
		
		layout: 'hbox',
		margin: 10,
		
		/**
		 * @property {FBEditor.editor.element.section.SectionElement} Элемент.
		 */
		sectionEl: null,
		
		/**
		 * @property {String} Заголовок секции.
		 */
		sectionName: '',
		
		/**
		 * @property {String} output Аттрибут секции.
		 */
		sectionOutput: '',
		
		initComponent: function ()
		{
			var me = this;
			
			me.items = [
				{
					xtype: 'window-outputsection-item-output',
					sectionEl: me.sectionEl,
					value: me.sectionOutput
				},
				{
					xtype: 'window-outputsection-item-name',
					sectionName: me.sectionName
				}
			];
			
			me.callParent(arguments);
		}
	}
);