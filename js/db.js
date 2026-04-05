let supabase;

const initDB = async () => {
    if (!supabase) {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        const supabaseUrl = 'https://fpvlywanyxizxyroddin.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdmx5d2FueXhpenh5cm9kZGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNzk1NjEsImV4cCI6MjA5MDg1NTU2MX0.dsgVPUXMT8qSdx7imm_nNaxDfMnDvKqODLBnLFT3G3U';
        supabase = createClient(supabaseUrl, supabaseKey);
    }
    return supabase;
};

const getAllPosts = async (type = null, includeArchived = false) => {
    const db = await initDB();
    let query = db.from('posts').select('*').order('date', { ascending: false });
    if (type) {
        query = query.eq('type', type);
    }
    if (!includeArchived) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        query = query.gte('date', sixMonthsAgo.toISOString());
    }
    const { data, error } = await query;
    if (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
    return data;
};

const getArchivedPosts = async (type = null) => {
    const db = await initDB();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    let query = db.from('posts').select('*').lt('date', sixMonthsAgo.toISOString()).order('date', { ascending: false });
    if (type) {
        query = query.eq('type', type);
    }
    const { data, error } = await query;
    if (error) {
        console.error('Error fetching archived posts:', error);
        throw error;
    }
    return data;
};

const getPostById = async (id) => {
    const db = await initDB();
    const { data, error } = await db.from('posts').select('*').eq('id', id).maybeSingle();
    if (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
    return data;
};

const addPost = async (post) => {
    const db = await initDB();
    const { data, error } = await db.from('posts').insert([
        { ...post, date: new Date().toISOString() }
    ]).select();
    
    if (error) {
        console.error('Error adding post:', error);
        throw error;
    }
    return data[0];
};

const deletePost = async (id) => {
    const db = await initDB();
    const { error } = await db.from('posts').delete().eq('id', id);
    if (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

const updatePost = async (id, postData) => {
    const db = await initDB();
    const { data, error } = await db.from('posts').update(postData).eq('id', id).select();
    if (error) {
        console.error('Error updating post:', error);
        throw error;
    }
    return data[0];
};

const compressImage = (file, maxWidth = 1024, quality = 0.7) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), { type: 'image/webp' }));
                }, 'image/webp', quality);
            };
        };
    });
};

const uploadImage = async (file) => {
    const db = await initDB();
    const compressedFile = await compressImage(file);
    const fileName = `${Math.random().toString(36).substring(2, 15)}.webp`;
    const filePath = `post-images/${fileName}`;

    const { error } = await db.storage.from('images').upload(filePath, compressedFile);
    if (error) {
        console.error('Error uploading image:', error);
        throw error;
    }

    const { data } = db.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
};

const seedDB = async () => {
    try {
        const posts = await getAllPosts();
        if (posts.length === 0) {
            const mockPosts = [
                {
                    title: "කෘත්‍රිම බුද්ධිය (AI) සහ අනාගත රැකියා වෙළඳපොළ",
                    content: "වර්තමානයේ කෘත්‍රිම බුද්ධිය (AI) වේගයෙන් වර්ධනය වෙමින් පවතී. මෙය ලෝකයේ සෑම අංශයකටම විශාල බලපෑමක් ඇති කරමින් තිබේ.\n\nමෙම තාක්ෂණය හරහා අපගේ දෛනික ජීවිතය, අධ්‍යාපනය, සෞඛ්‍ය අංශය මෙන්ම ව්‍යාපාරික ක්ෂේත්‍රයද සම්පූර්ණයෙන්ම වෙනස් වන බව විශේෂඥයින් මත පළ කරයි. බොහෝ දෙනා පවසන පරිදි අනාගතයේදී රැකියා වෙළඳපොළ සම්පූර්ණයෙන්ම නවීකරණය වනු ඇත.\n\nනව තාක්ෂණය ලබාදෙන පහසුකම් ප්‍රයෝජනයට ගනිමින් ශ්‍රී ලංකාවේ තරුණ පරපුර මෙම අංශයෙන් ඉදිරියට යාම අත්‍යවශ්‍ය වේ. මේ සඳහා පාසල් මට්ටමේ සිට කේතකරණය (Coding) සහ තාක්ෂණික කුසලතා වර්ධනය කෙරෙන වැඩසටහන් ආරම්භ කළ යුතුව ඇත.",
                    type: "news",
                    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    author: "තාක්ෂණික අංශය"
                },
                {
                    title: "වාර්ෂික මහා සභා රැස්වීම 2026",
                    content: "ආයතනයේ 2026 වර්ෂය සඳහා වන වාර්ෂික මහා සභා රැස්වීම ලබන මස 15 වන දින ප්‍රධාන ශ්‍රවණාගාරයේදී පැවැත්වීමට තීරණය කර ඇත.\n\nමෙම අවස්ථාවට සියලුම සේවකයින්ගේ සහභාගීත්වය අනිවාර්ය වේ. රැස්වීමේදී ඉකුත් වර්ෂයේ ප්‍රගතිය සමාලෝචනය කිරීම සහ ඉදිරි වර්ෂය සඳහා නව සැලසුම් හඳුන්වා දීම සිදුවනු ඇත.\n\nවැඩිදුර විස්තර පසුව දැනුම් දෙනු ලැබේ.",
                    type: "announcement",
                    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    author: "මානව සම්පත් කළමනාකරු"
                },
                {
                    title: "පරිසර සංරක්ෂණ ව්‍යාපෘතිය",
                    content: "අප සමාගමේ සමාජ සත්කාරක වැඩසටහනක් ලෙස නාගරික ප්‍රදේශයන්හි පැළ සිටුවීමේ ව්‍යාපෘතියක් ආරම්භ කර ඇත.\n\nමෙහි පළමු අදියර හෙට දින කොළඹ ප්‍රදේශයෙන් ආරම්භ වන අතර, මේ සඳහා සියලුම සේවකයින්ගේ ස්වේච්ඡා දායකත්වය බලාපොරොත්තු වෙමු. පරිසරය සුරැකීම අප සැමගේ වගකීමක් බව සලකන්න.",
                    type: "news",
                    image: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    author: "පරිපාලක"
                },
                {
                    title: "සේවා කාලය වෙනස් කිරීම",
                    content: "පවතින ප්‍රවාහන දුෂ්කරතා හේතුවෙන් කාර්යාල වේලාවන්හි සුළු වෙනස්කම් සිදු කිරීමට තීරණය කර ඇත.\n\nහෙට සිට සියලුම කාර්යාල වේලාවන් පෙරවරු 8:30 සිට පස්වරු 4:30 දක්වා ක්‍රියාත්මක වනු ඇත. කරුණාකර වෙනස්කම් පිලිබඳ වැඩිදුර විස්තර සඳහා ඔබේ අංශ ප්‍රධානියා හමුවන්න.",
                    type: "announcement",
                    image: "https://images.unsplash.com/photo-1520607162513-3fe364d9635b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    author: "කළමනාකාරිත්වය"
                },
                {
                    title: "ජාත්‍යන්තර ක්‍රීඩා උළෙලින් ශ්‍රී ලංකාවට රන් පදක්කමක්",
                    content: "මෙවර ජාත්‍යන්තර මලල ක්‍රීඩා උළෙල නියෝජනය කළ ශ්‍රී ලංකා කණ්ඩායම විශිෂ්ට දක්ෂතා දක්වමින් මීටර් 400 ඉසව්වෙන් රන් පදක්කමක් දිනාගැනීමට සමත් වී ඇත.\n\nමෙම ජයග්‍රහණය ශ්‍රී ලංකා ක්‍රීඩා ඉතිහාසයේ රන් අකුරින් ලියවෙනු ඇත. ජයග්‍රාහී ක්‍රීඩකයින්ට අපගේ උණුසුම් සුබපැතුම් එක් කරමු!",
                    type: "news",
                    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    author: "ක්‍රීඩා අංශය"
                },
                {
                    title: "නව කාර්යාලය විවෘත කිරීම",
                    content: "සමාගමේ ව්‍යාප්තියත් සමඟ අපගේ නවතම ශාඛාව මහනුවර නගරයේදී ලබන සතියේ විවෘත කිරීමට නියමිතය.\n\nනව ශාඛාව මඟින් මධ්‍යම පළාතේ පාරිභෝගිකයින්ට වඩාත් ඵලදායී හා කඩිනම් සේවාවක් ලබාදීමට හැකිවනු ඇතැයි අප විශ්වාස කරමු.",
                    type: "news",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    author: "ප්‍රධාන විධායක නිලධාරී"
                }
            ];

            for (const p of mockPosts) {
                await addPost(p);
            }
            console.log("Mock data seeded successfully.");
        }
    } catch (error) {
        console.error("Failed to seed db:", error);
    }
};

const getAppUserByCredentials = async (username, password) => {
    const db = await initDB();
    const { data, error } = await db.from('app_users').select('*').eq('username', username).eq('password', password).maybeSingle();
    if (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
    return data;
};

const updateUserPassword = async (username, newPassword) => {
    const db = await initDB();
    const { error } = await db.from('app_users').update({ password: newPassword }).eq('username', username);
    if (error) throw error;
    return true;
};

const getAppUsers = async () => {
    const db = await initDB();
    const { data, error } = await db.from('app_users').select('*').order('id', { ascending: true });
    if (error) throw error;
    return data;
};

const addAppUser = async (user) => {
    const db = await initDB();
    const { data, error } = await db.from('app_users').insert([user]).select();
    if (error) throw error;
    return data[0];
};

const deleteAppUser = async (id) => {
    const db = await initDB();
    const { error } = await db.from('app_users').delete().eq('id', id);
    if (error) throw error;
};

// Message functions
const addMessage = async (msg) => {
    const db = await initDB();
    const { data, error } = await db.from('messages').insert([
        { ...msg, created_at: new Date().toISOString(), status: 'new' }
    ]).select();
    if (error) throw error;
    return data[0];
};

const getMessages = async () => {
    const db = await initDB();
    const { data, error } = await db.from('messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

const updateMessageStatus = async (id, status) => {
    const db = await initDB();
    const { data, error } = await db.from('messages').update({ status }).eq('id', id).select();
    if (error) throw error;
    return data[0];
};

const deleteMessage = async (id) => {
    const db = await initDB();
    const { error } = await db.from('messages').delete().eq('id', id);
    if (error) throw error;
};

const searchPosts = async (query) => {
    const db = await initDB();
    const { data, error } = await db.from('posts').select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,title_ta.ilike.%${query}%,content_ta.ilike.%${query}%,title_en.ilike.%${query}%,content_en.ilike.%${query}%`)
        .order('date', { ascending: false });
    if (error) throw error;
    return data;
};

seedDB();
