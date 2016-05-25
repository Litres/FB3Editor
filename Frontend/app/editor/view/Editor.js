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
			'FBEditor.editor.History',
			'FBEditor.editor.Manager',
			'FBEditor.editor.view.EditorController',
			'FBEditor.editor.view.viewport.Viewport'
		],

		xtype: 'base-editor',
		controller: 'view.editor',

		layout: 'fit',

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
		//viewport: null,

		/**
		 * @private
		 * @property {FBEditor.editor.Manager} Менеджер редактора.
		 */
		//manager: null,

		/**
		 * @private
		 * @property {FBEditor.editor.History} История редактора.
		 */
		//history: null,

		/**
		 * @private
		 * @property {FBEditor.editor.element.root.RootElement} Корневой элемент редактора.
		 */
		//rootElement: null,

		afterRender: function ()
		{
			var me = this;

			// создаем менеджер
			me.createManager();

			// создаем историю
			me.history = Ext.create('FBEditor.editor.History');

			// инициализируем вид редактора
			me.initEditor();

			me.callParent(me);
		},

		/**
		 * @template
		 * Создает менеджер.
		 */
		createManager: function ()
		{
			var me = this;

			me.manager = me.manager || Ext.create('FBEditor.editor.Manager', me);
		},

		/**
		 * @template
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
		 * Создает структуру корневого элемента.
		 */
		createRootElement: function ()
		{
			var me = this,
				manager = me.getManager(),
				root;

			root = manager.createRootElement(me.rootElementName);

			// устанавливаем связи с корневым элементом
			me.setRootElement(root);
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

			root = me.getRootElement();
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
		},

		/**
		 * Возвращает менеджер.
		 * @return {FBEditor.editor.Manager}
		 */
		getManager: function ()
		{
			var me = this;

			if (!me.manager)
			{
				me.createManager();
			}

			return me.manager;
		},

		/**
		 * Возвращает историю.
		 * @return {FBEditor.editor.History}
		 */
		getHistory: function ()
		{
			return this.history;
		},

		/**
		 * Возвращает корневой элемент.
		 * @return {FBEditor.editor.element.root.RootElement}
		 */
		getRootElement: function ()
		{
			return this.rootElement;
		},

		/**
		 * Устанавилвает связь с корневым элементом.
		 * @param {FBEditor.editor.element.root.RootElement} root Корневой элемент.
		 */
		setRootElement: function (root)
		{
			var me = this;

			me.rootElement = root;
			root.setEditor(me);
		}
	}
);