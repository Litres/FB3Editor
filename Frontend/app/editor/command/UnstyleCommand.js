/**
 * Убирает форматирование в выделенных абзацах.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.editor.command.UnstyleCommand',
    {
        extend: 'FBEditor.editor.command.AbstractCommand',

        execute: function ()
        {
            var me = this,
                data = me.getData(),
                manager = data.manager,
                res = false,
                nodes = {},
                els = {},
                range,
                helper,
                viewportId;

            try
            {
	            if (manager.isSuspendCmd())
	            {
		            return false;
	            }
	
	            // получаем данные из выделения
	            range = data.range = manager.getRangeCursor();
	
	            // удаляем все оверлеи в тексте
	            manager.removeAllOverlays();
	
	            console.log('unstyle', data, range);

                manager.setSuspendEvent(true);

                // сохраняем данные для восстановления выделения
                data.cursor = {
                    start: range.start,
                    end: range.end,
                    offset: {
                        start: range.offset.start,
                        end: range.offset.end
                    }
                };
	
	            viewportId = data.viewportId = range.common.viewportId;
                els.common = range.common.getElement();
                els.first = range.start.getElement();
                els.firstP = els.first.getStyleHolder();
                els.last = range.end.getElement();
                els.lastP = els.last.getStyleHolder();
                nodes.pp = [];

                if (!els.firstP.equal(els.lastP))
                {
                    // получаем узлы выделенных абзацев между первым и последним абзацами
                    nodes.pp = manager.getNodesPP(range.start, nodes, els);

                    // добавляем последний абзац в полученный массив
                    helper = els.lastP.getNodeHelper();
                    nodes.lastP = helper.getNode();
                    nodes.pp.push(nodes.lastP);
                }

                // добавляем первый абзац в полученный массив
                helper = els.firstP.getNodeHelper();
                nodes.firstP = helper.getNode();
                nodes.pp.unshift(nodes.firstP);

                Ext.each(
                    nodes.pp,
                    function (p)
                    {
                        // удаляем стили в абзаце
                        me.removeStyles(p);
                    }
                );

                //console.log(viewportId, els, nodes);

                data.nodes = nodes;
                data.els = els;

                els.common.sync(viewportId);

	            manager.setChanged(true);

                // устанавливаем курсор
                manager.setCursor(
                    {
                        startNode: nodes.firstP
                    }
                );

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
                nodes = data.nodes,
                els = data.els,
                manager = data.manager,
                viewportId = data.viewportId,
                cursor = data.cursor,
                res = false;

            try
            {
                console.log('undo unstyle', data);
	
	            manager.removeAllOverlays();
                manager.setSuspendEvent(true);

                Ext.each(
                    nodes.pp,
                    function (p)
                    {
                        // восстанавливаем все стили в абзаце
                        me.restoreStyles(p);
                    }
                );

                els.common.sync(viewportId);

                // восстанавливаем выделение
                manager.setCursor(
                    {
                        startNode: cursor.start,
                        startOffset: cursor.offset.start,
                        endNode: cursor.end,
                        endOffset: cursor.offset.end
                    }
                );

                res = true;
            }
            catch (e)
            {
                Ext.log({level: 'warn', msg: e, dump: e});
                me.getHistory(els.common).remove();
            }

            manager.setSuspendEvent(false);

            return res;
        },

        /**
         * @private
         * Удаляет все стили в абзаце.
         * @param {Node} p Абзац.
         */
        removeStyles: function (p)
        {
            var me = this,
                manager,
                factory,
                el,
                text,
                viewportId;

            el = p.getElement();
            viewportId = p.viewportId;
            manager = el.getManager();
            factory = manager.getFactory();

            // получаем весь текст абзаца и создаем из него текстовый элемент
            text = factory.createElementText(el.getText());

            // сохраняем ссылки на дочерние элементы в узле абзаца
            p.restoreChildren = Ext.clone(el.children);

            // удаляем все дочерние элементы из абзаца
            el.removeAll(viewportId);

            // добавляем в пустой абзац только текстовый элемент
            el.add(text, viewportId);
        },

        /**
         * @private
         * Восстанавливает все стили в абзаце.
         * @param {Node} p Абзац.
         */
        restoreStyles: function (p)
        {
            var me = this,
                el,
                viewportId;

            el = p.getElement();
            viewportId = p.viewportId;

            // удаляем все дочерние элементы из абзаца
            el.removeAll(viewportId);

            // добавляем в пустой абзац все дочерние элементы
            Ext.each(
                p.restoreChildren,
                function (child)
                {
                    el.add(child, viewportId);
                }
            );
        }
    }
);