/**
 * Контейнер, в котором редактируются элементы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.viewport.Viewport',
	{
		extend: 'Ext.container.Container',
		requires: [
			'FBEditor.editor.view.viewport.ViewportController'
		],

		xtype: 'editor-viewport',
		controller: 'editor.viewport',
		cls: 'editor-viewport',

		layout: 'fit',

		afterRender: function ()
		{
			var me = this,
				editor = me.getEditor();

			me.callParent(me);
			me.createRoot();

			// устанавливаем связь корневого элемента с редактором
			editor.getRootElement().setEditor(editor);
		},

		/**
		 * Создает корневой элемент.
		 */
		createRoot: function ()
		{
			var me = this,
				manager = FBEditor.editor.Manager,
				factory = manager.getFactory(),
				editor = me.getEditor(),
				rootElementName,
				root,
				rootNode;

			rootElementName = editor.rootElementName;
			root = factory.createElement(rootElementName);

			editor.setRootElement(root);

			rootNode = root.getNode(me.id);
			me.loadData(rootNode);

			// создаем элементы корневого узла по умолчанию
			root.createScaffold();

			manager.suspendEvent = true;

			// добавляем узлы в корневой
			Ext.Array.each(
				root.children,
				function (item)
				{
					rootNode.appendChild(item.getNode(me.id));
				}
			);

			manager.suspendEvent = false;
		},

		/**
		 * Загружает html-данные в окно редактора.
		 * @param {HTMLElement} data Html-данные.
		 */
		loadData: function (data)
		{
			var me = this,
				dom,
				content;

			dom = me.getEl().dom;
			content = me.getContent();

			if (content)
			{
				// заменяем старое содержимое на новое
				dom.replaceChild(data, content);
			}
			else
			{
				// вставляем новое содержимое
				dom.appendChild(data);
			}
		},

		/**
		 * Возвращает xml.
		 * @return {String} Xml.
		 */
		getXml: function ()
		{
			var me = this,
				editor = me.getEditor(),
				root,
				xml;

			root = editor.getRootElement();
			xml = root.getXml();

			return xml;
		},

		/**
		 * Возвращает корневой узел контента.
		 * @return {Node}
		 */
		getContent: function ()
		{
			return this.getEl().dom.firstChild;
		},

		/**
		 * Возвращает редактор текста.
		 * @return {FBEditor.editor.view.Editor}
		 */
		getEditor: function ()
		{
			var me = this,
				editor;

			editor = me.up('base-editor');

			return editor;
		}
	}
);