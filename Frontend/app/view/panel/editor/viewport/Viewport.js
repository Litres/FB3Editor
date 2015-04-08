/**
 * Окно редактирования текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.editor.viewport.Viewport',
	{
		extend: 'Ext.container.Container',
		requires: [
			'FBEditor.view.panel.editor.viewport.ViewportController'
		],
		xtype: 'panel-editor-viewport',
		controller: 'panel.editor.viewport',
		layout: 'fit',
		cls: 'panel-editor-viewport',
		listeners: {
			change: 'onChange',
			syncScroll: 'onSyncScroll'
		},

		/**
		 * @property {Boolean} Создать ли корневой элемент.
		 */
		createRootElement: false,

		afterRender: function ()
		{
			var me = this,
				rootEl,
				rootNode,
				els = {};

			me.callParent(this);
			if (me.createRootElement)
			{
				rootEl = FBEditor.editor.Manager.createRootElement();
				rootNode = rootEl.getNode(me.id);
				me.loadData(rootNode);

				// создаем содержимое книги по умолчанию
				els.section = FBEditor.editor.Factory.createElement('section');
				els.p = FBEditor.editor.Factory.createElement('p');
				els.t = FBEditor.editor.Factory.createElementText('Текст книги');
				els.p.add(els.t);
				els.section.add(els.p);
				rootEl.add(els.section);
				FBEditor.editor.Manager.suspendEvent = true;
				rootNode.appendChild(els.section.getNode(me.id));
				FBEditor.editor.Manager.suspendEvent = false;
			}
		},

		/**
		 * Загружает данные тела книги в окно редактора.
		 * @param {HTMLElement} data Тело книги.
		 */
		loadData: function (data)
		{
			var me = this,
				dom = me.getEl().dom,
				content = me.getContent();

			if (content)
			{
				dom.replaceChild(data, content);
			}
			else
			{
				dom.appendChild(data);
			}
		},

		/**
		 * Возвращает корневой элемент контента.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getContent: function ()
		{
			return this.getEl().dom.firstChild;
		}
	}
);