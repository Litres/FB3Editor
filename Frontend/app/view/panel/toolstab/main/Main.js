/**
 * Вкладка Форматирование.
 *
 * Синхронизация кнопок вызывается из менеджера FBEditor.editor.Manager#syncButtons().
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.Main',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.toolstab.main.MainController',
			'FBEditor.view.panel.toolstab.main.button.a.A',
			'FBEditor.view.panel.toolstab.main.button.annotation.Annotation',
			'FBEditor.view.panel.toolstab.main.button.blockquote.Blockquote',
			'FBEditor.view.panel.toolstab.main.button.code.Code',
			'FBEditor.view.panel.toolstab.main.button.div.Div',
			'FBEditor.view.panel.toolstab.main.button.em.Em',
			'FBEditor.view.panel.toolstab.main.button.epigraph.Epigraph',
			'FBEditor.view.panel.toolstab.main.button.img.Img',
			'FBEditor.view.panel.toolstab.main.button.note.Note',
			'FBEditor.view.panel.toolstab.main.button.notebody.Notebody',
			'FBEditor.view.panel.toolstab.main.button.notes.Notes',
			'FBEditor.view.panel.toolstab.main.button.ol.Ol',
			'FBEditor.view.panel.toolstab.main.button.poem.Poem',
			'FBEditor.view.panel.toolstab.main.button.pre.Pre',
			'FBEditor.view.panel.toolstab.main.button.section.Section',
			'FBEditor.view.panel.toolstab.main.button.spacing.Spacing',
			'FBEditor.view.panel.toolstab.main.button.strikethrough.Strikethrough',
			'FBEditor.view.panel.toolstab.main.button.strong.Strong',
			'FBEditor.view.panel.toolstab.main.button.sub.Sub',
			'FBEditor.view.panel.toolstab.main.button.subscription.Subscription',
			'FBEditor.view.panel.toolstab.main.button.subtitle.Subtitle',
			'FBEditor.view.panel.toolstab.main.button.sup.Sup',
			'FBEditor.view.panel.toolstab.main.button.table.Table',
			'FBEditor.view.panel.toolstab.main.button.title.Title',
			'FBEditor.view.panel.toolstab.main.button.titlebody.TitleBody',
			'FBEditor.view.panel.toolstab.main.button.ul.Ul',
			'FBEditor.view.panel.toolstab.main.button.underline.Underline'
		],
		id:'panel-toolstab-main',
		xtype: 'panel-toolstab-main',
		controller: 'panel.toolstab.main',

		title: 'Форматирование',

		listeners: {
			syncButtons: 'onSyncButtons',
			disableButtons: 'onDisableButtons'
		},

		/**
		 * @private
		 * @property {FBEditor.view.panel.toolstab.main.button.AbstractButton[]} Кнопки элементов.
		 * @property {FBEditor.view.panel.toolstab.main.button.AbstractButton[]} [Object.sequence] Список кнопок.
		 * Список sequence содержит в себе однотипные кнопки элементов, которые проверяются по схеме одинаково.
		 */
		buttons: [],

		translateText: {
			loading: 'Загрузка xmllint ...'
		},

		initComponent: function ()
		{
			var me = this,
				manager = FBEditor.editor.Manager,
				sch = manager.getSchema(),
				tbar;

			// вызываем тестовую проверку по схеме для определения загрузки xmllint
			sch.validXml({xml: 'test', callback: me.verifyResult, scope: me});

			tbar = [
				{
					xtype: 'panel-toolstab-main-button-notes'
				},
				{
					xtype: 'panel-toolstab-main-button-notebody'
				},
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					xtype: 'panel-toolstab-main-button-titlebody'
				},
				{
					xtype: 'panel-toolstab-main-button-section'
				},
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					xtype: 'panel-toolstab-main-button-title'
				},
				{
					xtype: 'panel-toolstab-main-button-epigraph'
				},
				{
					xtype: 'panel-toolstab-main-button-annotation'
				},
				{
					xtype: 'panel-toolstab-main-button-subscription'
				},
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					xtype: 'panel-toolstab-main-button-div'
				},
				{
					xtype: 'panel-toolstab-main-button-subtitle'
				},
				{
					xtype: 'panel-toolstab-main-button-blockquote'
				},
				{
					xtype: 'panel-toolstab-main-button-pre'
				},
				{
					xtype: 'panel-toolstab-main-button-poem'
				},
				{
					xtype: 'panel-toolstab-main-button-ul'
				},
				{
					xtype: 'panel-toolstab-main-button-ol'
				},
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					xtype: 'panel-toolstab-main-button-table'
				},
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					xtype: 'panel-toolstab-main-button-img'
				},
				{
					xtype: 'panel-toolstab-main-button-a'
				},
				{
					xtype: 'panel-toolstab-main-button-note'
				},
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					xtype: 'panel-toolstab-main-button-strong'
				},
				{
					xtype: 'panel-toolstab-main-button-em'
				},
				{
					xtype: 'panel-toolstab-main-button-underline'
				},
				{
					xtype: 'panel-toolstab-main-button-strikethrough'
				},
				{
					xtype: 'panel-toolstab-main-button-spacing'
				},
				{
					xtype: 'panel-toolstab-main-button-sub'
				},
				{
					xtype: 'panel-toolstab-main-button-sup'
				},
				{
					xtype: 'panel-toolstab-main-button-code'
				}
			];

			me.dockedItems = [
				{
					xtype: 'toolbar',
					dock: 'top',
					items: tbar,
					hidden: true
				}
			];

			me.items = [
				{
					xtype: 'component',
					padding: 10,
					style: {
						color: 'gray'
					},
					html: me.translateText.loading
				}
			];

			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this;

			me.callParent(arguments);

			// создаем список кнопок
			me.buttons = [
				me.down('panel-toolstab-main-button-notes'),
				me.down('panel-toolstab-main-button-notebody'),
				me.down('panel-toolstab-main-button-titlebody'),
				me.down('panel-toolstab-main-button-section'),
				me.down('panel-toolstab-main-button-title'),
				me.down('panel-toolstab-main-button-epigraph'),
				me.down('panel-toolstab-main-button-annotation'),
				me.down('panel-toolstab-main-button-subscription'),
				{
					sequence: [
						me.down('panel-toolstab-main-button-div'),
						me.down('panel-toolstab-main-button-subtitle'),
						me.down('panel-toolstab-main-button-blockquote'),
						me.down('panel-toolstab-main-button-pre'),
						me.down('panel-toolstab-main-button-poem')
					]
				},
				me.down('panel-toolstab-main-button-ul'),
				me.down('panel-toolstab-main-button-ol'),
				me.down('panel-toolstab-main-button-table'),
				me.down('panel-toolstab-main-button-img'),
				me.down('panel-toolstab-main-button-a'),
				me.down('panel-toolstab-main-button-note'),
				me.down('panel-toolstab-main-button-strong'),
				me.down('panel-toolstab-main-button-em'),
				me.down('panel-toolstab-main-button-underline'),
				me.down('panel-toolstab-main-button-strikethrough'),
				me.down('panel-toolstab-main-button-spacing'),
				me.down('panel-toolstab-main-button-sub'),
				me.down('panel-toolstab-main-button-sup'),
				me.down('panel-toolstab-main-button-code')
			];
		},

		/**
		 * Возвращает список кнопок.
		 * @return {Object[]}
		 */
		getButtons: function ()
		{
			return this.buttons;
		},

		/**
		 * Получает результат проверки xmllint.
		 * @param {Boolean} res
		 * @param {Object} data
		 * @param {Boolean} data.loaded Загружен ли xmllint.
		 */
		verifyResult: function (res, data)
		{
			var me = this;

			if (data.loaded)
			{
				Ext.log({msg: 'xmllint загружен', level: 'info'});

				me.getDockedItems()[0].setVisible(true);
			}
		}
	}
);