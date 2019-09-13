/**
 * Сдвигает секцию вправо (увеличивает вложенность).
 * Текущая секция помещается в хвост предыдущей секции.
 * Если в предыдущей секции нет вложенных секций,
 * то сначадал создаем там вложенную секцию и затем перемещаем нашу под нее.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.editor.command.section.RightCommand',
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
	            
	            console.log('section -> right', range);
	
	            // удаляем все оверлеи в тексте
	            manager.removeAllOverlays();

                node = range.common;
	            viewportId = data.viewportId = node.viewportId;
                els.node = node.getElement();
                manager = els.node.getManager();
                els.focus = manager.getFocusElement();
                factory = manager.getFactory();
                manager.setSuspendEvent(true);

                // текущая секция
                els.section = els.focus.isSection ? els.focus : els.focus.getParentName('section');

                // предыдущая секция
                els.sectionPrev = els.section ? els.section.prev() : null;

                if (!els.sectionPrev || !els.sectionPrev.isSection)
                {
                    return false;
                }

                // родительский элемент секций
                els.parent = els.section.getParent();
                
                if (!els.sectionPrev.last().isSection)
                {
                    // если в предыдущей секции нет вложенных секци,
                    // то создаем вложенную секцию
	
	                // новая вложенная секция
	                els.sectionInner = factory.createElement('section');
	                els.sectionPrev.add(els.sectionInner, viewportId);

	                // переносим все элементы во вложенную
	                els.sectionPrev.moveTo(els.sectionInner, viewportId);
                }

                // переносим текущую секциию в предыдущую
                els.sectionPrev.add(els.section, viewportId);

                // сохраняем ссылки на элементы
                data.els = els;

                // синхронизируем элемент
                els.parent.sync(viewportId);

                // восстанавливаем выделение
                manager.restoreSelection();

                // проверяем по схеме
                me.verifyElement(els.parent);

                res = true;
            }
            catch (e)
            {
                Ext.log({level: 'warn', msg: e, dump: e});
                me.getHistory(els.parent).removeNext();
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
                viewportId,
                manager;

            try
            {
                viewportId = data.viewportId;
                els = data.els;
                manager = els.focus.getManager();
	            manager.removeAllOverlays();
                manager.setSuspendEvent(true);

                // переносим секцию обратно
	
	            els.sectionNext = els.sectionPrev.next();
	            
	            if (els.sectionNext)
                {
	                els.parent.insertBefore(els.section, els.sectionNext, viewportId);
                }
                else
                {
	                els.parent.add(els.section, viewportId);
                }
                
                if (els.sectionInner)
                {
                    // удаляем вложенную секцию из предыдущей, предаврительно перенеся все элементы
	                els.sectionInner.upChildren(viewportId);
                }

                // синхронизируем элемент
                els.parent.sync(viewportId);

                // восстанавливаем курсор
                manager.restoreSelection();

                res = true;
            }
            catch (e)
            {
                Ext.log({level: 'warn', msg: e, dump: e});
                me.getHistory(els.parent).removeNext();
            }

            manager.setSuspendEvent(false);

            return res;
        }
    }
);