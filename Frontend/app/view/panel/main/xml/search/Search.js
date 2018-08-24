/**
 * Панель поиска по xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.search.Search',
    {
        extend: 'Ext.Container',
        requires: [
            'FBEditor.view.panel.main.xml.search.SearchController',
	        'FBEditor.view.panel.main.xml.search.ignoreCase.IgnoreCase',
            'FBEditor.view.panel.main.xml.search.close.Close',
	        'FBEditor.view.panel.main.xml.search.count.Count',
	        'FBEditor.view.panel.main.xml.search.findNext.FindNext',
	        'FBEditor.view.panel.main.xml.search.findPrev.FindPrev',
	        'FBEditor.view.panel.main.xml.search.regex.Regex',
	        'FBEditor.view.panel.main.xml.search.textfield.Textfield',
	        'FBEditor.view.panel.main.xml.search.words.Words'
        ],

        id: 'panel-xml-search',
        xtype: 'panel-xml-search',
        controller: 'panel.xml.search',
	    
	    cls: 'panel-xml-search',

        listeners: {
            change: 'onChange',
	        findNext: 'onFindNext',
	        findPrev: 'onFindPrev'
        },
	
	    layout: {
		    type: 'hbox',
		    align: 'stretch'
	    },
	    
	    width: '100%',

        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.Xml} Редактор xml.
         */
        xmlPanel: null,

        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.search.textfield.Textfield} Поле ввода текста для поиска.
         */
        searchField: null,
	
	    /**
	     * @private
	     * @property {FBEditor.view.panel.main.xml.search.regex.Regex} Чекбокс установки регулярного поиска.
	     */
	    regexField: null,
	
	    /**
	     * @private
	     * @property {FBEditor.view.panel.main.xml.search.ignoreCase.IgnoreCase} Чекбокс установки учитывания регистра.
	     */
	    caseField: null,
	
	    /**
	     * @private
	     * @property {FBEditor.view.panel.main.xml.search.words.Words} Чекбокс установки поиска слов.
	     */
	    wordsField: null,
	
	    /**
	     * @private
	     * @property {FBEditor.view.panel.main.xml.search.count.Count} Поле количества найденных результатов.
	     */
	    countField: null,

        initComponent: function ()
        {
            var me = this;

            me.items = [
                {
                    xtype: 'panel-xml-search-textfield',
	                width: 300
                },
	            {
		            xtype: 'panel-xml-search-findprev'
	            },
	            {
		            xtype: 'panel-xml-search-findnext'
	            },
	            {
		            xtype: 'panel-xml-search-ignorecase'
	            },
	            {
		            xtype: 'panel-xml-search-words'
	            },
	            {
		            xtype: 'panel-xml-search-regex'
	            },
	            {
		            xtype: 'panel-xml-search-count',
		            flex: 1
	            },
                {
                    xtype: 'panel-xml-search-close'
                }
            ];

            me.callParent(arguments);
        },

        afterShow: function ()
        {
            var me = this,
                searchField = me.getSearchField();

            // ставим фокус в текстовое поле
            searchField.focus();
            
            // вбрасываем событие для нового поиска
            me.fireEvent('change');

            me.callParent(arguments);
        },
        
        afterHide: function ()
        {
	        var me = this,
		        xmlPanel,
                manager;
	
	        xmlPanel = me.getXmlPanel();
	        manager = xmlPanel.getManager();
	        
	        // убираем подсветку текста после предыдущего поиска
	        manager.search();

	        me.callParent(arguments);
        },

        /**
         * Возвращает редактор xml.
         * @return {FBEditor.view.panel.main.xml.Xml}
         */
        getXmlPanel: function ()
        {
            var me = this,
                panel;

            panel = me.xmlPanel || me.up('main-xml');
            me.xmlPanel = panel;

            return panel;
        },

        /**
         * Возвращает данные для поиска.
         * @return {Object}
         * @return {String} Object.searchText Текст поиска.
         */
        getDataForSearch: function ()
        {
            var me = this,
                searchField = me.getSearchField(),
                regexField = me.getRegexField(),
	            caseField = me.getCaseField(),
	            wordsField = me.getWordsField(),
                data;

            data = {
                searchText: searchField.getValue(),
                isReg: regexField.getValue(),
	            ignoreCase: !caseField.getValue(),
	            words: wordsField.getValue()
            };
            
            //console.log('data', data);

            return data;
        },

        /**
         * Возвращает поле ввода текста для поиска.
         * @return {FBEditor.view.panel.main.xml.search.textfield.Textfield}
         */
        getSearchField: function ()
        {
            var me = this,
                cmp;
	
	        cmp = me.searchField || me.down('panel-xml-search-textfield');
            me.searchField = cmp;

            return cmp;
        },
	
	    /**
	     * Возвращает чекбокс установки регулярного поиска.
	     * @return {FBEditor.view.panel.main.xml.search.regex.Regex}
	     */
	    getRegexField: function ()
	    {
		    var me = this,
			    cmp;
		
		    cmp = me.regexField || me.down('panel-xml-search-regex');
		    me.regexField = cmp;
		
		    return cmp;
	    },
	
	    /**
	     * Возвращает чекбокс установки учитывания регистра.
	     * @return {FBEditor.view.panel.main.xml.search.ignoreCase.IgnoreCase}
	     */
	    getCaseField: function ()
	    {
		    var me = this,
			    cmp;
		
		    cmp = me.caseField || me.down('panel-xml-search-ignorecase');
		    me.caseField = cmp;
		
		    return cmp;
	    },
	
	    /**
	     * Возвращает чекбокс установки поиска слов.
	     * @return {FBEditor.view.panel.main.xml.search.words.Words}
	     */
	    getWordsField: function ()
	    {
		    var me = this,
			    cmp;
		
		    cmp = me.wordsField || me.down('panel-xml-search-words');
		    me.wordsField = cmp;
		
		    return cmp;
	    },
	
	    /**
	     * Возвращает поле количества найденных результатов.
	     * @return {FBEditor.view.panel.main.xml.search.count.Count}
	     */
	    getCountField: function ()
	    {
		    var me = this,
			    cmp;
		
		    cmp = me.countField || me.down('panel-xml-search-count');
		    me.countField = cmp;
		
		    return cmp;
	    }
    }
);