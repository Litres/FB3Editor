/**
 * Кнотроллер элемента img.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.img.ImgElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		onKeyDownDelete: function (e)
		{
			var me = this;

			e.preventDefault();

			me.remove();
		},

		onKeyDownBackspace: function (e)
		{
			var me = this;

			e.preventDefault();

			me.remove();
		},

		/**
		 * Удаляет изображение.
		 */
		remove: function ()
		{
			var me = this,
				cmd;

			cmd = Ext.create('FBEditor.editor.command.DeleteCommand', {el: me.getElement()});
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
		},

		getNodeVerify: function (sel, opts)
		{
			var me = this,
				els = {},
				nodes = {},
				res,
				sch,
				name,
				range,
				nameElements;

			// данные выделения
			range = opts.range;
			nodes.node = range.start;
			nodes.parent = nodes.node.parentNode;

			// получаем дочерние имена элементов для проверки по схеме
			nameElements = ['img'];//me.getNameElementsVerify(nodes);

			// проверяем элемент по схеме
			sch = FBEditor.editor.Manager.getSchema();
			els.parent = nodes.parent.getElement();
			name = els.parent.xmlTag;
			res = sch.verify(name, nameElements) ? nodes.node : false;

			return res;
		}
	}
);