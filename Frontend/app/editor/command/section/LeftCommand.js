/**
 * Сдвигает секцию влево (уменьшает вложеность).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.editor.command.section.LeftCommand',
    {
        extend: 'FBEditor.editor.command.AbstractCommand',

        execute: function ()
        {
            var me = this,
                data = me.getData(),
	            manager = FBEditor.getEditorManager(),
                res = false,
                els = {},
                node,
                factory,
                viewportId,
                range;

            try
            {
	            if (manager.isSuspendCmd())
	            {
		            return false;
	            }
	
	            // получаем данные из выделения
	            range = manager.getRangeCursor();
	
	            console.log('section -> left', range);
	
	            // удаляем все оверлеи в тексте
	            manager.removeAllOverlays();

                node = range.common;
	            viewportId = data.viewportId = node.viewportId;
                els.node = node.getElement();
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

                els.sectionPrev = els.section.prev();

                if (els.sectionPrev)
                {
                    // переносим все элементы, расположенные выше текущей, в новую секцию

                    els.sectionNew = factory.createElement('section');
                    els.sectionParent.insertBefore(els.sectionNew, els.parent, viewportId);
                    els.first = els.parent.first();

                    while (!els.first.equal(els.section))
                    {
                        els.sectionNew.add(els.first, viewportId);
                        els.first = els.parent.first();
                    }

                    if (!els.sectionPrev.isSection)
                    {
                        // добавляем пустой абзац
                        els.emptyP = manager.createEmptyP();
                        els.sectionNew.add(els.emptyP, viewportId);
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
	            manager.removeAllOverlays();
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
                    if (els.emptyP)
                    {
                        // удаляем пустой абзац
                        els.sectionNew.remove(els.emptyP);
                    }

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