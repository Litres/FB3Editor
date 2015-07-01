/**
 * Панель свойств редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.Body',
	{
		extend: 'FBEditor.view.panel.main.props.Abstract',
		requires: [
			'FBEditor.view.panel.main.props.body.BodyController',
			'FBEditor.view.panel.main.props.body.Info',
			'FBEditor.view.button.editor.ConvertElement',
			'FBEditor.view.button.editor.DeleteElement',
			'FBEditor.view.panel.main.props.body.editor.section.Editor',
			'FBEditor.view.panel.main.props.body.editor.p.Editor',
			'FBEditor.view.panel.main.props.body.editor.img.Editor'
		],
		controller: 'panel.props.body',
		id: 'panel-props-body',
		xtype: 'panel-props-body',
		layout: {
			type: 'vbox'
		},
		listeners: {
			beforeactivate: 'onBeforeActivate',
			afterRender: 'onAfterRender',
			loadData: 'onLoadData'
		},

		/**
		 * @property {Ext.panel.Panel} Панель редактирования элемента.
		 */
		editor: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'props-element-info'
				},
				{
					xtype: 'button-editor-convert-element',
					width: '100%',
					hidden: true,
					style: {
						margin: '0 0 10px 0'
					}
				},
				{
					xtype: 'button-editor-delete-element',
					width: '100%',
					hidden: true,
					style: {
						margin: '0 0 10px 0'
					}
				}
			];
			me.callParent(arguments);
		},

		getContentId: function ()
		{
			return 'main-editor';
		}
	}
);