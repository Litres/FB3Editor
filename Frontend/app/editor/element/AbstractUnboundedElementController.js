/**
 * Абстрактный класс контроллера элементов блочного типа неограниченных по количеству.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractUnboundedElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		createFromRange: true,

		getNodeVerify: function (sel, opts)
		{
			var me = this,
				els = {},
				nodes = {},
				name,
				range;

			name = me.getNameElement();

			// получаем узел из выделения
			sel = sel || window.getSelection();
			range = sel.getRangeAt(0);

			nodes.node = range.commonAncestorContainer;
			els.node = nodes.node.getElement();
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();

			while (els.parent.isStyleHolder || els.parent.isStyleType)
			{
				nodes.node = nodes.parent;
				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
			}

			els.parent = nodes.parent.getElement();
			nodes.node = els.parent.hisName(name) ? nodes.parent : nodes.node;

			// можно не делать дополнительную проверку, так как кнопки на панели уже проверяют схему при синхронизации
			return nodes.node;
		},

		/**
		 * Проверяет по схеме создание нового элемента из выделения.
		 * @param {Selection} sel Выделение.
		 * @return {Boolean} Успешность проверки.
		 */
		checkRangeVerify: function (sel)
		{
			// можно не делать дополнительную проверку, так как кнопки на панели уже проверяют схему при синхронизации
			return true;

		},

		getNameElementsVerify: function (nodes)
		{
			var me = this,
				els = {},
				manager,
				nameElements,
				name;

			name = me.getNameElement();

			els.parent = nodes.parent.getElement();
			nodes.node = els.parent.hisName(name) ? nodes.parent : nodes.node;
			nodes.parent = nodes.node.parentNode;
			els.node = nodes.node.getElement();
			els.parent = nodes.parent.getElement();

			manager = els.parent.getManager();
			nameElements = manager.getNamesElements(els.parent);
			nameElements.splice(els.parent.getChildPosition(els.node) + 1, 0, name);

			return nameElements;
		}
	}
);