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
                }

                // синхронизируем
                els.common.sync(data.viewportId);

                // устанавливаем курсор
                /*manager.setCursor(
                    {
                        startNode: nodes.focus
                    }
                );*/

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
				range,
				viewportId;

			try
			{
				range = data.range;
				els = data.els;
				viewportId = data.viewportId;
				manager = data.manager;

				console.log('undo create element ' + me.elementName + ' from object', els);



				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);

			return res;
		}
	}
);