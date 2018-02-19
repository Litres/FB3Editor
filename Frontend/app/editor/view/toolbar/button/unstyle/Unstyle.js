/**
 * Кнопка удаления форматирования.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.editor.view.toolbar.button.unstyle.Unstyle',
    {
        extend: 'FBEditor.editor.view.toolbar.button.AbstractButton',
        requires: [
            'FBEditor.editor.view.toolbar.button.unstyle.UnstyleController'
        ],

        controller: 'editor.toolbar.button.unstyle',
        xtype: 'editor-toolbar-button-unstyle',

        html: '<i class="fa fa-eraser"></i>',
        tooltip: 'Убрать форматирование',

        elementName: 'unstyle',

        isActiveSelection: function ()
        {
            var me = this,
                manager = me.getEditorManager(),
                active = false,
                sel = window.getSelection(),
                nodes = {},
                els = {},
                range,
                helper;

            /**
             * Проверяет абзац на наличие стилевых элементов.
             * @param {Node} p Абзац.
             * @return {Boolean} Есть ли хотя бы один стилевой элемент.
             */
            function checkStyles (p)
            {
                var res = false,
                    el = p.getElement();

                el.each(
                    function (child)
                    {
                        if (child.isStyleType)
                        {
                                res = true;

                                return false;
                        }
                    }
                );

                return res;
            }

            range = sel.rangeCount ? sel.getRangeAt(0) : null;

            if (!range || !range.commonAncestorContainer.getElement)
            {
                return false;
            }

            els.common = range.commonAncestorContainer.getElement();
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
                    // ищем стили в абзаце
                    if (checkStyles(p))
                    {
                            active = true;

                            return false;
                    }
                }
            );

            return active;
        }
    }
);