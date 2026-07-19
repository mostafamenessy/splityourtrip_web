/* jshint esversion: 6 */
/* jshint esversion: 11 */

import { useEffect } from 'react';
import { useContextex } from '../context/useContext';

export const usePropertyList = () => {
    const { setFeaturedPropList, isUserId, setPropertyType, selectedCountryId, setTabsList } = useContextex();

    useEffect(() => {
        // Fetch country data when component mounts or isUserId changes
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_home_data.php?`, {
                    uid: isUserId || '0',
                    country_id: selectedCountryId || 0
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const { Catlist, Featured_Property, show_add_property } = response?.data?.HomeData
                localStorage.setItem('addPropertyShow', show_add_property)
                setTabsList(Catlist || []);
                setFeaturedPropList(Featured_Property || []);
                setPropertyType(Catlist || []);
            } catch (err) {
                console.error(err.message); // Set error if request fails
            }
        };

        fetchCountryDataAsync();
    }, [isUserId, selectedCountryId, isUserId]);

    return {
        setFeaturedPropList,
        setPropertyType,
        setTabsList
    };
};
