/**
 *  Компонент редактора текста для описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.editor.Editor',
	{
		extend: 'Ext.Panel',
		requires: [
			'FBEditor.view.form.desc.editor.EditorController',
			'FBEditor.view.form.desc.editor.body.Body',
			'FBEditor.view.form.desc.editor.toolbar.Toolbar'
		],

		xtype: 'form-desc-editor',
		controller: 'form.desc.editor',
		cls: 'form-desc-editor',

		layout: 'fit',
		bodyStyle: {
			background: 'none'
		},

		listeners: {
			loadData: 'onLoadData'
		},

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.editor.body.Body} Редактор текста.
		 */
		bodyEditor: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'form-desc-editor-body',
					rootElementName: me.rootElementName
				}
			];

			me.dockedItems = [
				{
					xtype: 'form-desc-editor-toolbar',
					dock: 'top'
				}
			];

			me.callParent(arguments);
		},

		getValues: function (d)
		{
			var me = this,
				data = d;

			data[me.name] = me.getValue();

			return data;
		},

		/**
		 * Возвращает значение.
		 * @return {String} Значение.
		 */
		getValue: function ()
		{
			var me = this,
				bodyEditor,
				val;

			bodyEditor = me.getBodyEditor();
			val = bodyEditor.getValue();

			return val;
		},

		/**
		 * Возвращает редактор текста.
		 * @return {FBEditor.view.form.desc.editor.body.Body}
		 */
		getBodyEditor: function ()
		{
			var me = this,
				bodyEditor;

			bodyEditor = me.bodyEditor || me.down('form-desc-editor-body');
			me.bodyEditor = bodyEditor;

			return bodyEditor;
		}
	}
);