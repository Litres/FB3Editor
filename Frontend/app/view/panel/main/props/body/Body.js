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
			'FBEditor.view.panel.main.props.body.editor.a.Editor',
			'FBEditor.view.panel.main.props.body.editor.annotation.Editor',
			'FBEditor.view.panel.main.props.body.editor.blockquote.Editor',
			'FBEditor.view.panel.main.props.body.editor.div.Editor',
			'FBEditor.view.panel.main.props.body.editor.epigraph.Editor',
			'FBEditor.view.panel.main.props.body.editor.img.Editor',
			'FBEditor.view.panel.main.props.body.editor.note.Editor',
			'FBEditor.view.panel.main.props.body.editor.notebody.Editor',
			'FBEditor.view.panel.main.props.body.editor.notes.Editor',
			'FBEditor.view.panel.main.props.body.editor.ol.Editor',
			'FBEditor.view.panel.main.props.body.editor.pre.Editor',
			'FBEditor.view.panel.main.props.body.editor.section.Editor',
			'FBEditor.view.panel.main.props.body.editor.stanza.Editor',
			'FBEditor.view.panel.main.props.body.editor.subscription.Editor',
			'FBEditor.view.panel.main.props.body.editor.table.Editor',
			'FBEditor.view.panel.main.props.body.editor.td.Editor',
			'FBEditor.view.panel.main.props.body.editor.title.Editor',
			'FBEditor.view.panel.main.props.body.editor.tr.Editor',
			'FBEditor.view.panel.main.props.body.editor.ul.Editor'
		],

		id: 'panel-props-body',
		xtype: 'panel-props-body',
		controller: 'panel.props.body',

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
		},

		/**
		 * Возвращает кнопку "конвертировать в текст".
		 * @return {FBEditor.view.button.editor.ConvertElement}
		 */
		getConvertBtn: function ()
		{
			return this.down('button-editor-convert-element');
		},

		/**
		 * Возвращает кнопку "удалить элемент".
		 * @return {FBEditor.view.button.editor.DeleteElement}
		 */
		getDeleteBtn: function ()
		{
			return this.down('button-editor-delete-element');
		}
	}
);