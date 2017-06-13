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
			'FBEditor.view.form.desc.editor.Manager',
			'FBEditor.view.form.desc.editor.body.Body'
		],

		xtype: 'form-desc-editor',
		controller: 'form.desc.editor',
		
		cls: 'form-desc-editor',

		listeners: {
			loadData: 'onLoadData'
		},

		bodyStyle: {
			background: 'none'
		},

		layout: 'fit',

		/**
		 * @property {Boolean} Показывать ли тулбар по умолчанию.
		 */
		defaultShowToolbar: false,

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.editor.body.Body} Редактор текста.
		 */
		bodyEditor: null,

		/**
		 * @private
		 * @property {String} Название корневого элемента.
		 */
		rootElementName: '',

		afterRender: function ()
		{
			var me = this,
				bodyEditor;

			// панель редактора
			bodyEditor = Ext.widget(
				'form-desc-editor-body',
				{
					rootElementName: me.rootElementName,
					defaultShowToolbar: me.defaultShowToolbar
				}
			);
			
			me.bodyEditor = bodyEditor;
			me.add(bodyEditor);

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
			return this.bodyEditor;
		},

		/**
		 * Возвращает название корневого элемента.
		 * @return {String} 
		 */
		getRootElementName: function ()
		{
			return this.rootElementName;
		}
	}
);