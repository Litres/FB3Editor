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
                sel = window.getSelection(),
                res = false,
                nodes = {},
                els = {},
                cursor,
                range,
                helper,
                viewportId;

            try
            {
                manager.setSuspendEvent(true);
                range = sel.getRangeAt(0);

                // сохраняем данные для восстановления выделения
                data.cursor = {
                    start: range.startContainer,
                    end: range.endContainer,
                    offset: {
                        start: range.startOffset,
                        end: range.endOffset
                    }
                };

                console.log('unstyle', data, range);

                els.common = range.commonAncestorContainer.getElement();
                data.viewportId = viewportId = range.commonAncestorContainer.viewportId;
                els.first = range.startContainer.getElement();
                els.firstP = els.first.getStyleHolder();
                els.last = range.endContainer.getElement();
                els.lastP = els.last.getStyleHolder();
                nodes.pp = [];

                if (!els.firstP.equal(els.lastP))
                {
                    // получаем узлы выделенных абзацев между первым и последним абзацами
                    nodes.pp = manager.getNodesPP(range.startContainer, nodes, els);

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