/**
 * Базовый компонент редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.Editor',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.editor.view.EditorController',
			'FBEditor.editor.view.viewport.Viewport'
		],

		xtype: 'base-editor',
		controller: 'view.editor',

		listeners: {
			loadData: 'onLoadData'
		},

		/**
		 * @property {String} Название корневого элемента.
		 */
		rootElementName: 'root',

		/**
		 * @private
		 * @property {FBEditor.editor.view.viewport.Viewport} Контейнер редактора текста.
		 */
		viewport: null,

		afterRender: function ()
		{
			var me = this;

			me.initEditor();
			me.callParent(me);
		},

		/**
		 * Инициализирует редактор.
		 */
		initEditor: function ()
		{
			var me = this;

			me.add(
				{
					xtype: 'editor-viewport'
				}
			);
		},

		/**
		 * Возвращает значение.
		 * @return {String} Значение.
		 */
		getValue: function ()
		{
			var me = this,
				viewport = me.getViewport(),
				root,
				name,
				val;

			root = viewport.getRootElement();
			name = root.getName();
			val = viewport.getXml();

			// преобразуем пустой элемент
			val = val.replace('<' + name + '></' + name + '>', '');

			return val;
		},

		/**
		 * Возвращает контейнер редактора текста.
		 * @return {FBEditor.editor.view.viewport.Viewport}
		 */
		getViewport: function ()
		{
			var me = this,
				viewport;

			viewport = me.viewport || me.down('editor-viewport');
			me.viewport = viewport;

			return viewport;
		}
	}
);