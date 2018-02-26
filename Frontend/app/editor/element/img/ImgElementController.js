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

		onKeyDownCtrlX: function (e)
		{
			//
		},

		onFocus: function (e)
		{
			var me = this,
				el = me.getElement(),
				sel = window.getSelection(),
                target = e.target,
				nodes = {},
				els = {},
				viewportId,
				helper;

			//console.log('sel', sel, e);

			// текущий фокусный элемент в выделении
			nodes.focus = sel.focusNode;
			els.focus = nodes.focus && nodes.focus.getElement ? nodes.focus.getElement() : null;
			viewportId = target.viewportId;

			if (els.focus && !els.focus.isImg)
			{
				// снимаем выделение в тексте, чтобы не было одновременно двух выделений
				sel.removeAllRanges();

				helper = el.getNodeHelper();
				nodes.focus = helper.getNode(viewportId);

				// устанвливаем в качестве выделения текущее изображение
				sel.collapse(nodes.focus, 0);

				// восстанавливаем фокус на изображении
				nodes.focus.focus();
			}

			me.callParent(arguments);
		},

		onCut: function (e)
		{
            var me = this;

            // удаляем изображение из модели
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