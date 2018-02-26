/**
 * Кнотроллер корневого элемента описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.desc.AbstractRootElementController',
	{
		extend: 'FBEditor.editor.element.root.RootElementController',

        onMouseDown: function (e)
        {
            var me = this,
                nodes = {},
                els = {},
                manager,
                helper,
                viewportId;

            nodes.target = e.target;
            els.target = nodes.target.getElement ? nodes.target.getElement() : null;

            if (els.target.isRoot)
            {
                // при клике по пустому корневому элементу ставим курсор в конец строки самого последнего абзаца

                manager = els.target.getManager();
                viewportId = nodes.target.viewportId;

                els.last = els.target.getDeepLast();
                helper = els.last.getNodeHelper();
                nodes.last = helper.getNode(viewportId);
                els.offset = els.last.isText ? els.last.text.length : 0;

                manager.setCursor(
                    {
                        startNode: nodes.last,
                        startOffset: els.offset
                    }
                );

                e.preventDefault();
            }
        },

		onMouseUp: function (e)
		{
			var me = this,
				node;

			me.callParent(arguments);

			node = me.getFocusNode(e.target);

			// проверяем активность тулбара
			me.checkActiveToolbar(node);
		},

		/**
		 * @private
		 * Проверяет активен ли тулбар текущего редактора текста.
		 * Если нет, то активирует его.
		 * @param {Node} node Фокусный узел элемента в редакторе под курсором.
		 */
		checkActiveToolbar: function (node)
		{
			var me = this,
				manager,
				editor,
				toolbar,
				el;

			el = node.getElement ? node.getElement() : null;

			if (el)
			{
				manager = el.getManager();
				editor = manager.getEditor();
				toolbar = editor.getToolbar();

				if (!toolbar.isActive())
				{
					// делаем тулбар активным
					toolbar.setActive();
				}
			}
		}
	}
);