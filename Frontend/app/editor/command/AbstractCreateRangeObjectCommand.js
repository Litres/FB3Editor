/**
 * Абстрактная команда создания элемента из выделения с объектом (изображение).
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCreateRangeObjectCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		/**
		 * @property {String} Имя элемента.
		 */
		elementName: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager,
				factory,
                viewportId;

			try
			{
				// выделенный элемент
                nodes.focus = data.opts.focus;
                els.focus = nodes.focus.getElement();
                els.prev = els.focus.prev(); // для undo
                els.holder = els.focus.getStyleHolder();
                els.nextHolder = els.holder.next();
                els.prevHolder = els.holder.prev();
                els.common = els.holder.parent;
				viewportId = data.viewportId = nodes.focus.viewportId;
                manager = data.manager = els.focus.getManager();
                factory = manager.getFactory();
                manager.setSuspendEvent(true);

                // разбиваем узел текущего выделения
                nodes.container = nodes.focus;
                nodes.splitContainer = manager.splitNode(els, nodes, 0);
                els.splitContainer = nodes.splitContainer.getElement();

                // создаем новый элемент c выделенным объектом
				els.node = factory.createElement(me.elementName);
				els.common.insertBefore(els.node, els.splitContainer, viewportId);
				els.p = factory.createElement('p');
                els.node.add(els.p, viewportId);
                els.p.add(els.focus, viewportId);

                if (els.holder.isEmpty())
				{
					// удаляем, ставший пустым, исходный абзац объекта
					els.common.remove(els.holder, viewportId);
				}

				if (els.splitContainer.isEmpty())
                {
                    // удаляем лишний пустой абзац
                    els.common.remove(els.splitContainer, viewportId);
                    els.splitIsEmpty = true;
                }

                // синхронизируем
                els.common.sync(data.viewportId);

                // устанавливаем курсор
                manager.setCursor(
                    {
                        startNode: nodes.focus
                    }
                );

                data.els = els;

                // проверяем по схеме
                me.verifyElement(els.common);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.common).removeNext();
			}

			manager.setSuspendEvent(false);
			
			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager,
				helper,
				viewportId;

			try
			{
				//range = data.range;
				els = data.els;
				viewportId = data.viewportId;
				manager = data.manager;
                manager.setSuspendEvent(true);
                nodes.focus = data.opts.focus;

				console.log('undo create element ' + me.elementName + ' from object', els);

                // переносим объект обратно

				if (els.holder.isEmpty())
				{
					els.common.insertBefore(els.holder, els.node, viewportId);
                    els.holder.add(els.focus, viewportId);
				}
				else if (els.prev)
                {
                    els.prev.parent.add(els.focus, viewportId);
                }
                else
				{
                    els.holder.add(els.focus, viewportId);
				}

                // удаляем новый элемент
                els.common.remove(els.node, viewportId);

                // переносим элементы из разделенного абзаца обратно

				els.first = els.splitContainer.first();
                els.join = els.first;

				while (els.first)
				{
					els.holder.add(els.first, viewportId);
                    els.first = els.splitContainer.first();
				}

				// удаляем новый абзац
                if (!els.splitIsEmpty)
				{
					els.common.remove(els.splitContainer, viewportId);
                }

				if (els.prev && !els.join.isText)
				{
                    // соединяем разделенные элементы в абзаце
					helper = els.join.getNodeHelper();
					nodes.join = helper.getNode(viewportId);
					manager.joinNode(nodes.join);

					// удаляем пустые узлы после соединения
                    helper = els.holder.getNodeHelper();
                    nodes.holder = helper.getNode(viewportId);
					manager.removeEmptyNodes(nodes.holder);
				}

                // синхронизируем
                els.common.sync(data.viewportId);

                // устанавливаем курсор
                manager.setCursor(
                    {
                        startNode: nodes.focus
                    }
                );

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);
			manager.updateTree();

			return res;
		}
	}
);