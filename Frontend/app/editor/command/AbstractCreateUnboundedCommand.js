/**
 * Абстрактный класс команды создания неограниченных по количеству блочных элементов.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCreateUnboundedCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		/**
		 * @property {String} Имя элемента.
		 */
		elementName: null,

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				factory = FBEditor.editor.Factory,
				viewportId = data.viewportId;

			els.parent = els.node.getParent();
			els.node = els.parent.hisName(me.elementName) ? els.parent : els.node;
			els.parent = els.node.getParent();
			els.next = els.node.next();

			// создаем элемент
			els.node = factory.createElement(me.elementName);
			els = Ext.apply(els, els.node.createScaffold());

			if (els.next)
			{
				els.parent.insertBefore(els.node, els.next, viewportId);
			}
			else
			{
				els.parent.add(els.node, viewportId);
			}
		}
	}
);