/**
 * Сдвигает секцию влево (уменьшает вложеность).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.editor.command.section.LeftCommand',
    {
        extend: 'FBEditor.editor.command.AbstractCreateCommand',

        execute: function ()
        {
            var me = this,
                data = me.getData(),
                res = false,
                els = {},
                node,
                factory,
                viewportId,
                manager,
                sel,
                range;

            try
            {
                // получаем данные из выделения
                sel = window.getSelection();
                range = sel.getRangeAt(0);

                node = range.commonAncestorContainer;
                data.viewportId = viewportId = node.viewportId;
                els.node = node.getElement();
                manager = els.node.getManager();
                factory = manager.getFactory();
                els.focus = manager.getFocusElement();

                manager.setSuspendEvent(true);

                // текущая секция
                els.section = els.focus.isSection ? els.focus : els.focus.getParentName('section');

                // родительская секция
                els.parent = els.section.parent && els.section.parent.isSection ? els.section.parent : null;

                // родительский элемент родительской секции
                els.sectionParent = els.parent.parent;

                if (!els.parent)
                {
                    return false;
                }

                els.sectionPrev = els.section.prev() && els.section.prev().isSection ? els.section.prev() : null;

                if (els.sectionPrev)
                {
                    // переносим все секции, расположенные выше текущей, в новую секцию

                    els.sectionNew = factory.createElement('section');
                    els.sectionParent.insertBefore(els.sectionNew, els.parent, viewportId);
                    els.first = els.parent.first();

                    while (!els.first.equal(els.section))
                    {
                        els.sectionNew.add(els.first, viewportId);
                        els.first = els.parent.first();
                    }
                }

                // переносим текущую секцию на уровень выше
                els.sectionParent.insertBefore(els.section, els.parent, viewportId);

                if (els.parent.isEmpty())
                {
                    //если текущая родительская секция осталась пустой, удаляем ее
                    els.sectionParent.remove(els.parent, viewportId);
                }

                // сохраняем ссылки на элементы
                data.els = els;

                // синхронизируем элемент
                els.sectionParent.sync(viewportId);

                // восстанавливаем выделение
                manager.restoreSelection();

                // проверяем по схеме
                me.verifyElement(els.sectionParent);

                res = true;
            }
            catch (e)
            {
                Ext.log({level: 'warn', msg: e, dump: e});
                me.getHistory(els.sectionParent).removeNext();
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
                manager,
                viewportId;

            try
            {
                viewportId = data.viewportId;
                els = data.els;
                manager = els.focus.getManager();

                manager.setSuspendEvent(true);

                // восстанавливаем порядок всех секций

                if (els.parent.isEmpty())
                {
                    // восстанавливаем удаленную родительскую секцию
                    els.sectionParent.insertBefore(els.parent, els.section, viewportId);

                    els.parent.add(els.section, viewportId);
                }
                else
                {
                    els.parent.insertBefore(els.section, els.parent.first(), viewportId);
                }

                if (els.sectionNew)
                {
                    // переносим все секции, расположенные выше текущей, обратно в родительскую секцию

                    els.first = els.sectionNew.first();

                    while (els.first)
                    {
                        els.parent.insertBefore(els.first, els.section, viewportId);
                        els.first = els.sectionNew.first();
                    }

                    // удаляем новую секцию
                    els.sectionParent.remove(els.sectionNew, viewportId);
                }

                // синхронизируем элемент
                els.sectionParent.sync(viewportId);

                // восстанавливаем выделение
                manager.restoreSelection();

                // проверяем по схеме
                me.verifyElement(els.sectionParent);

                res = true;
            }
            catch (e)
            {
                Ext.log({level: 'warn', msg: e, dump: e});
                me.getHistory(els.sectionParent).removeNext();
            }

            manager.setSuspendEvent(false);

            return res;
        }
    }
);