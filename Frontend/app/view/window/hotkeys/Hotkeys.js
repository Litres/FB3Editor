/**
 * Редактор горячих клавиш.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.window.hotkeys.Hotkeys',
    {
        extend: 'Ext.Window',
        requires: [
            'FBEditor.view.window.hotkeys.slot.a.A',
            'FBEditor.view.window.hotkeys.slot.annotation.Annotation',
            'FBEditor.view.window.hotkeys.slot.blockquote.Blockquote',
            'FBEditor.view.window.hotkeys.slot.bold.Bold',
            'FBEditor.view.window.hotkeys.slot.code.Code',
            'FBEditor.view.window.hotkeys.slot.div.Div',
            'FBEditor.view.window.hotkeys.slot.epigraph.Epigraph',
            'FBEditor.view.window.hotkeys.slot.img.Img',
            'FBEditor.view.window.hotkeys.slot.italic.Italic',
            'FBEditor.view.window.hotkeys.slot.note.Note',
            'FBEditor.view.window.hotkeys.slot.notebody.Notebody',
            'FBEditor.view.window.hotkeys.slot.notes.Notes',
            'FBEditor.view.window.hotkeys.slot.ol.Ol',
            'FBEditor.view.window.hotkeys.slot.pre.Pre',
            'FBEditor.view.window.hotkeys.slot.section.Section',
            'FBEditor.view.window.hotkeys.slot.smallcaps.Smallcaps',
            'FBEditor.view.window.hotkeys.slot.spacing.Spacing',
            'FBEditor.view.window.hotkeys.slot.span.Span',
            'FBEditor.view.window.hotkeys.slot.stanza.Stanza',
            'FBEditor.view.window.hotkeys.slot.strikethrough.Strikethrough',
            'FBEditor.view.window.hotkeys.slot.sub.Sub',
            'FBEditor.view.window.hotkeys.slot.subscription.Subscription',
            'FBEditor.view.window.hotkeys.slot.subtitle.Subtitle',
            'FBEditor.view.window.hotkeys.slot.sup.Sup',
            'FBEditor.view.window.hotkeys.slot.title.Title',
            'FBEditor.view.window.hotkeys.slot.titlebody.Titlebody',
            'FBEditor.view.window.hotkeys.slot.ul.Ul',
            'FBEditor.view.window.hotkeys.slot.underline.Underline',
            'FBEditor.view.window.hotkeys.slot.unstyle.Unstyle'
        ],

        xtype: 'window-hotkeys',
        id: 'window-hotkeys',

        width: 500,
        height: '80%',
        modal: true,
        closeAction: 'hide',
        scrollable: 'y',

        translateText: {
            title: 'Редактор горячих клавиш'
        },

        initComponent: function ()
        {
            var me = this,
                tt = me.translateText;

            me.title = tt.title;

            me.callParent(arguments);
        },

        afterRender: function ()
        {
            var me = this,
                slots;

            slots = me.getSlots();
            me.add(slots);

            me.callParent(arguments);
        },

        /**
         * Возвращает слоты горячих клавиш.
         * @return {FBEditor.view.window.hotkeys.slot.AbstractSlot[]}
         */
        getSlots: function ()
        {
            var me = this,
                slots;

            slots = [
                {
                    xtype: 'window-hotkeys-slot-notes',
                    numberSlot: 1
                },
                {
                    xtype: 'window-hotkeys-slot-notebody',
                    numberSlot: 2
                },
                {
                    xtype: 'window-hotkeys-slot-titlebody',
                    numberSlot: 3
                },
                {
                    xtype: 'window-hotkeys-slot-section',
                    numberSlot: 4
                },
                {
                    xtype: 'window-hotkeys-slot-title',
                    numberSlot: 5
                },
                {
                    xtype: 'window-hotkeys-slot-epigraph',
                    numberSlot: 6
                },
                {
                    xtype: 'window-hotkeys-slot-annotation',
                    numberSlot: 7
                },
                {
                    xtype: 'window-hotkeys-slot-subscription',
                    numberSlot: 8
                },
                {
                    xtype: 'window-hotkeys-slot-div',
                    numberSlot: 9
                },
                {
                    xtype: 'window-hotkeys-slot-subtitle',
                    numberSlot: 10
                },
                {
                    xtype: 'window-hotkeys-slot-blockquote',
                    numberSlot: 11
                },
                {
                    xtype: 'window-hotkeys-slot-pre',
                    numberSlot: 12
                },
                {
                    xtype: 'window-hotkeys-slot-stanza',
                    numberSlot: 13
                },
                {
                    xtype: 'window-hotkeys-slot-ul',
                    numberSlot: 14
                },
                {
                    xtype: 'window-hotkeys-slot-ol',
                    numberSlot: 15
                },
                {
                    xtype: 'window-hotkeys-slot-img',
                    numberSlot: 16
                },
                {
                    xtype: 'window-hotkeys-slot-a',
                    numberSlot: 17
                },
                {
                    xtype: 'window-hotkeys-slot-note',
                    numberSlot: 18
                },
                {
                    xtype: 'window-hotkeys-slot-bold',
                    numberSlot: 19
                },
                {
                    xtype: 'window-hotkeys-slot-italic',
                    numberSlot: 20
                },
                {
                    xtype: 'window-hotkeys-slot-underline',
                    numberSlot: 21
                },
                {
                    xtype: 'window-hotkeys-slot-strikethrough',
                    numberSlot: 22
                },
                {
                    xtype: 'window-hotkeys-slot-spacing',
                    numberSlot: 23
                },
                {
                    xtype: 'window-hotkeys-slot-sub',
                    numberSlot: 24
                },
                {
                    xtype: 'window-hotkeys-slot-sup',
                    numberSlot: 25
                },
                {
                    xtype: 'window-hotkeys-slot-code',
                    numberSlot: 26
                },
                {
                    xtype: 'window-hotkeys-slot-span',
                    numberSlot: 27
                },
                {
                    xtype: 'window-hotkeys-slot-smallcaps',
                    numberSlot: 29
                },
                {
                    xtype: 'window-hotkeys-slot-unstyle',
                    numberSlot: 28
                }
            ];

            return slots;
        }
    }
);