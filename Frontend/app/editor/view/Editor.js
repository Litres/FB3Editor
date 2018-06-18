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
			'FBEditor.editor.Manager',
			'FBEditor.editor.view.EditorController',
			'FBEditor.editor.view.toolbar.Toolbar',
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
		viewport: null,

		/**
		 * @private
		 * @property {FBEditor.editor.view.toolbar.Toolbar} Панель кнопок форматирования редактора текста.
		 */
		toolbar: null,

		/**
		 * @private
		 * @property {FBEditor.editor.Manager} Менеджер редактора.
		 */
		manager: null,

		/**
		 * @property {Boolean} Показывать ли тулбар по умолчанию.
		 */
		defaultShowToolbar: false,

		afterRender: function ()
		{
			var me = this,
				panelToolstab,
				toolbar;

			// создаем менеджер
			me.createManager();

			// инициализируем вид редактора
			me.initEditor();

			// создаем тулбар
			toolbar = me.createToolbar();
			toolbar.setDefaultShow(me.defaultShowToolbar);

			// связываем тулбар с панелью редактора
			me.setToolbar(toolbar);

			// вкладка форматирования
			panelToolstab = Ext.getCmp('panel-toolstab-main');

			// добавляем тулбар на вкладку
			panelToolstab.addToolbar(toolbar);

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
            var me = this,
                viewport;

            viewport = Ext.widget(
                {
                    xtype: 'editor-viewport'
                }
            );

            me.viewport = viewport;
            me.add(viewport);
		},

		/**
		 * @template
		 * Создает и возвращает тулбар.
		 * @return {FBEditor.editor.view.toolbar.Toolbar}
		 */
		createToolbar: function ()
		{
			return Ext.create('FBEditor.editor.view.toolbar.Toolbar');
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

			// устанавливаем связь с корневым элементом
			root.setEditor(me);
		},

		/**
		 * Возвращает значение.
		 * @return {String} Значение.
		 */
		getValue: function ()
		{
			var me = this,
				manager = me.getManager(),
				root,
				xml;

			// корневой элемент
			root = manager.getContent();

			// получаем xml-строку без форматирования
			xml = root.getXml(false, true);

			// вырезаем корневой элемент, оставляя только его содержимое
			xml = xml.replace(/^<.*?>(.*)<\/.*?>$/g, '$1');

			// вырезаем пустую строку
			xml = xml.replace(/^<p>[&#160; ]?<\/p>$/, '');
			xml = xml.replace(/^<p\/>$/, '');

			return xml;
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
		 * Связывает редактор с тулбаром.
		 * @param {FBEditor.editor.view.toolbar.Toolbar} toolbar Тулбар.
		 */
		setToolbar: function (toolbar)
		{
			var me = this,
				tool = toolbar;

			me.toolbar = tool;
			tool.setEditor(me);
		},

		/**
		 * Возвращает тулбар.
		 * @return {FBEditor.editor.view.toolbar.Toolbar}
		 */
		getToolbar: function ()
		{
			return this.toolbar;
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
			var me = this,
				manager = me.getManager();

			return manager.getHistory();
		}
	}
);