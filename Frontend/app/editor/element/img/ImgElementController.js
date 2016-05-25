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
				me.getHistory().add(cmd);
			}
		},

		getNodeVerify: function (sel, opts)
		{
			var me = this,
				nodes = {},
				range;

			// данные выделения
			range = opts.range;
			nodes.node = range.start;

			return nodes.node;
		}
	}
);