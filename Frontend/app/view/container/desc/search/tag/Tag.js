/**
 * Контейнер для отображения данных тегов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.container.desc.search.tag.Tag',
	{
		extend: 'FBEditor.view.container.desc.search.Container',
		requires: [
			'FBEditor.view.container.desc.search.tag.TagController',
			'FBEditor.view.container.desc.search.tag.TagStore'
		],
		
		controller: 'container.desc.search.tag',
		xtype: 'container-desc-search-tag',
		cls: 'container-search-tag',

		translateText: {
			searching: 'Поиск тегов...',
			notFound: 'Ничего не найдено'
		},

		createStore: function ()
		{
			return Ext.create('FBEditor.view.container.desc.search.tag.TagStore');
		},

		load: function (data)
		{
			var me = this;

			me.maskSearching(false);
			me.fireEvent('afterLoad', data);

			if (data && data.length)
			{
				Ext.Array.each(
					data,
					function (item)
					{
						var tag,
							tagItems;

						if (item)
						{
							tagItems = [
								{
									xtype: 'component',
									html: me.getHtmlItems(item),
									afterRender: function ()
									{
										me.afterRenderItem(this);
									}
								}
							];

							tag = {
								xtype: 'container',
								width: '100%',
								cls: 'panel-tag-item',
								items: tagItems
							};

							me.add(tag);
						}
					}
				);
			}
			else
			{
				me.notFound();
			}

			me.updateLayout();
		},

		/**
		 * @private
		 * Вызывается после добавления записи в контейнер.
		 * @param {Ext.Component} tagCmp Компонент записи.
		 */
		afterRenderItem: function (tagCmp)
		{
			var me = this,
				name;

			// добалвяем обработчик события при клике по тегу
			name = tagCmp.getEl().query('.panel-tag-item-name')[0];
			name.addEventListener(
				'click',
				function ()
				{
					var record,
						tagId;

					tagId = this.getAttribute('tag-id');
					record = me.store.getRecord('id', tagId);
					me.selectFn(record);
				}
			);
		},

		/**
		 * @private
		 * Возвращает html для отображения данных записи.
		 * @param {Object} data Данные записи.
		 * @return {String} Строка html.
		 */
		getHtmlItems: function (data)
		{
			var me = this,
				params = me.store.params || {},
				tpl,
				html;

			tpl = new Ext.XTemplate(
				'<div class="panel-tag-item-common">' +
				'   <div class="panel-tag-item-name" tag-id="{id}">{value}</div>' +
				'</div>'
			);

			data.value = data.value ? data.value.replace(new RegExp('(' + params.term + ')', 'i'), '<b>$1</b>') : '';
			data.value = data.value.trim();

			html = tpl.apply(data);

			return html;
		}
	}
);